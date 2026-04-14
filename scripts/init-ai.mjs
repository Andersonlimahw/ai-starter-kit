#!/usr/bin/env node
/**
 * init-ai — AI Agent Scaffold Generator
 * Gera infraestrutura de AI agents em qualquer repositório.
 * Uso: node scripts/init-ai.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');
const TARGET_DIR = process.cwd();

const BASE_FILES = [
  { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
  { dest: 'GEMINI.md', symlink: 'AGENTS.md' },
];

const CLAUDE_FILES = [
  { src: '.claude/settings.json', dest: '.claude/settings.json' },
  { src: '.claude/SKILLS.md', dest: '.claude/SKILLS.md' },
  { src: '.claude/skills/semantic-commit/SKILL.md', dest: '.claude/skills/semantic-commit/SKILL.md' },
  { src: '.claude/skills/code-review/SKILL.md', dest: '.claude/skills/code-review/SKILL.md' },
  { src: '.claude/skills/debug-workflow/SKILL.md', dest: '.claude/skills/debug-workflow/SKILL.md' },
  { src: '.claude/skills/llm-wiki/SKILL.md', dest: '.claude/skills/llm-wiki/SKILL.md' },
  { src: '.claude/hooks/git-setup.sh', dest: '.claude/hooks/git-setup.sh', executable: true },
  { src: '.claude/agents/task-router.md', dest: '.claude/agents/task-router.md' },
  { src: '.claude/agents/code-reviewer.md', dest: '.claude/agents/code-reviewer.md' },
  { src: '.claude/agents/debugger.md', dest: '.claude/agents/debugger.md' },
];

const CODEX_FILES = [
  { src: '.codex/settings.json', dest: '.codex/settings.json' },
  { src: '.codex/commands/project-commit.md', dest: '.codex/commands/project-commit.md' },
  { src: '.codex/agents/task-router.md', dest: '.codex/agents/task-router.md' },
];

const GEMINI_FILES = [
  { src: '.gemini/skills/llm-wiki/SKILL.md', dest: '.gemini/skills/llm-wiki/SKILL.md' },
];

const COPILOT_FILES = [
  { src: '.agent/skills/semantic-commit/SKILL.md', dest: '.agent/skills/semantic-commit/SKILL.md' },
  { src: '.agent/subagents/task-router.md', dest: '.agent/subagents/task-router.md' },
];

function isMainModule() {
  if (!process.argv[1]) {
    return false;
  }

  return import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
}

async function loadPrompts() {
  try {
    return await import('@inquirer/prompts');
  } catch (error) {
    const cause = error && typeof error === 'object' && 'message' in error ? error.message : String(error);
    throw new Error(
      `Dependência @inquirer/prompts indisponível. Rode "npm install" antes de usar init-ai. Detalhe: ${cause}`
    );
  }
}

function pathExists(targetPath) {
  return fs.lstatSync(targetPath, { throwIfNoEntry: false }) !== undefined;
}

export function replacePlaceholders(content, vars) {
  return Object.entries(vars).reduce((text, [key, value]) => {
    return text.replaceAll(`{{${key}}}`, String(value ?? ''));
  }, content);
}

export function getTemplateFiles(clis = []) {
  const selected = new Set(['claude', ...clis]);
  const files = [...BASE_FILES];

  if (selected.has('claude')) {
    files.push(...CLAUDE_FILES);
  }

  if (selected.has('codex')) {
    files.push(...CODEX_FILES);
  }

  if (selected.has('gemini')) {
    files.push(...GEMINI_FILES);
  }

  if (selected.has('copilot')) {
    files.push(...COPILOT_FILES);
  }

  return files;
}

export function detectCli(name) {
  try {
    const resolver = process.platform === 'win32' ? 'where' : 'which';
    execSync(`${resolver} ${JSON.stringify(name)}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export async function fetchExtraSkillsCatalog() {
  try {
    const response = await fetch('https://skills.sh/api/catalog', {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

function backupPathFor(destPath) {
  let candidate = `${destPath}.bak`;
  let counter = 1;

  while (fs.existsSync(candidate)) {
    candidate = `${destPath}.bak.${counter}`;
    counter += 1;
  }

  return candidate;
}

function writeRegularFile(file, vars, destPath) {
  const srcPath = path.join(TEMPLATES_DIR, file.src);
  const raw = fs.readFileSync(srcPath, 'utf8');
  const content = replacePlaceholders(raw, vars);
  fs.writeFileSync(destPath, content, 'utf8');

  if (file.executable) {
    fs.chmodSync(destPath, 0o755);
  }
}

function writeSymlink(file, destPath) {
  if (pathExists(destPath)) {
    try {
      const stat = fs.lstatSync(destPath);
      if (stat.isDirectory()) {
        fs.rmSync(destPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(destPath);
      }
    } catch {
      // O destino pode ainda não existir; seguimos para criar o link.
    }
  }

  fs.symlinkSync(file.symlink, destPath, 'file');
}

export function writeFiles(files, vars, conflictStrategy = 'skip', targetDir = TARGET_DIR) {
  const written = [];
  const skipped = [];

  for (const file of files) {
    const destPath = path.join(targetDir, file.dest);
    const exists = pathExists(destPath);

    if (exists && conflictStrategy === 'skip') {
      skipped.push(file.dest);
      continue;
    }

    if (exists && conflictStrategy === 'backup') {
      fs.renameSync(destPath, backupPathFor(destPath));
    }

    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    if (file.symlink) {
      writeSymlink(file, destPath);
      written.push(file.dest);
      continue;
    }

    writeRegularFile(file, vars, destPath);
    written.push(file.dest);
  }

  return { written, skipped };
}

function getDetectedClis() {
  return {
    claude: detectCli('claude'),
    codex: detectCli('codex'),
    gemini: detectCli('gemini'),
    copilot: detectCli('copilot') || detectCli('gh-copilot'),
  };
}

function getConflicts(files, targetDir = TARGET_DIR) {
  return files.filter((file) => pathExists(path.join(targetDir, file.dest)));
}

async function handleAddSkillMode() {
  const { select, checkbox, confirm } = await loadPrompts();

  console.log('\nAI Agent Skill Installer (Community)');
  console.log('='.repeat(40));

  console.log('\nBuscando catálogo de skills...');
  const catalog = await fetchExtraSkillsCatalog();

  const mockSkills = [
    { id: 'jest-pro', name: 'Jest Pro', description: 'Expertise em testes unitários e mocks', url: 'https://raw.githubusercontent.com/example/skills/main/jest-pro.md' },
    { id: 'docker-master', name: 'Docker Master', description: 'Otimização de Dockerfiles e Compose', url: 'https://raw.githubusercontent.com/example/skills/main/docker-master.md' },
    { id: 'sql-optimizer', name: 'SQL Optimizer', description: 'Análise de queries e indexação', url: 'https://raw.githubusercontent.com/example/skills/main/sql-optimizer.md' },
  ];

  const skills = catalog?.skills || mockSkills;

  if (!catalog) {
    console.log('Aviso: Usando catálogo offline de exemplo.');
  }

  const selectedSkills = await checkbox({
    message: 'Selecione as skills que deseja instalar:',
    choices: skills.map(s => ({
      name: `${s.name} - ${s.description}`,
      value: s
    }))
  });

  if (selectedSkills.length === 0) {
    console.log('\nNenhuma skill selecionada.');
    return;
  }

  const targetCli = await select({
    message: 'Para qual CLI deseja instalar?',
    choices: [
      { name: 'Claude Code (.claude/skills)', value: 'claude' },
      { name: 'Gemini CLI (.gemini/skills)', value: 'gemini' },
      { name: 'Codex (.codex/skills)', value: 'codex' },
      { name: 'Copilot (.agent/skills)', value: 'copilot' },
    ]
  });

  const cliPaths = {
    claude: '.claude/skills',
    gemini: '.gemini/skills',
    codex: '.codex/skills',
    copilot: '.agent/skills'
  };

  const baseDir = cliPaths[targetCli];

  console.log(`\nInstalando ${selectedSkills.length} skill(s) em ${baseDir}...`);

  for (const skill of selectedSkills) {
    const skillDir = path.join(TARGET_DIR, baseDir, skill.id);
    const destPath = path.join(skillDir, 'SKILL.md');

    if (fs.existsSync(destPath)) {
      const overwrite = await confirm({
        message: `Skill "${skill.name}" já existe. Sobrescrever?`,
        default: false
      });
      if (!overwrite) {
        console.log(`  - Pulei ${skill.name}`);
        continue;
      }
    }

    fs.mkdirSync(skillDir, { recursive: true });

    // Mock download (simulando fetch do conteúdo)
    const content = `# ${skill.name}\n\n${skill.description}\n\n(Conteúdo baixado de ${skill.url})`;
    fs.writeFileSync(destPath, content, 'utf8');
    console.log(`  + Instalada: ${skill.name}`);
  }

  console.log('\nFinalizado com sucesso.');
}

export async function main() {
  if (process.argv.includes('--add-skill')) {
    await handleAddSkillMode();
    return;
  }

  const { input, select, checkbox, confirm } = await loadPrompts();

  console.log('\nAI Agent Scaffold Generator');
  console.log('='.repeat(40));
  console.log(`Destino: ${TARGET_DIR}\n`);

  const projectName = await input({
    message: 'Nome do projeto:',
    default: path.basename(TARGET_DIR),
  });

  const description = await input({
    message: 'Descrição curta:',
    default: 'Projeto com suporte a AI agents',
  });

  const language = await select({
    message: 'Linguagem principal:',
    choices: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Outra'].map((value) => ({
      value,
      name: value,
    })),
  });

  const stack = await input({
    message: 'Stack/frameworks (opcional):',
    default: language,
  });

  const detected = getDetectedClis();
  const selectedClis = await checkbox({
    message: 'Quais AI CLIs você usa? (espaço para marcar)',
    choices: [
      {
        name: `Claude Code [recomendado${detected.claude ? ' | instalado' : ''}]`,
        value: 'claude',
        checked: true,
      },
      {
        name: `OpenAI Codex CLI${detected.codex ? ' | instalado' : ''}`,
        value: 'codex',
        checked: detected.codex,
      },
      {
        name: `Gemini CLI${detected.gemini ? ' | instalado' : ''}`,
        value: 'gemini',
        checked: detected.gemini,
      },
      {
        name: `GitHub Copilot CLI${detected.copilot ? ' | instalado' : ''}`,
        value: 'copilot',
        checked: detected.copilot,
      },
    ],
  });

  const clis = Array.from(new Set(['claude', ...selectedClis]));
  const wantExtra = await confirm({
    message: 'Consultar catálogo opcional de skills externas (skills.sh/aitmpl.com)?',
    default: false,
  });

  const vars = {
    PROJECT_NAME: projectName,
    PROJECT_DESCRIPTION: description,
    LANGUAGE: language,
    STACK: stack,
  };

  const files = getTemplateFiles(clis);
  const conflicts = getConflicts(files);
  let conflictStrategy = 'skip';

  if (conflicts.length > 0) {
    console.log(`\n${conflicts.length} arquivo(s) já existem no destino:`);
    for (const file of conflicts) {
      console.log(`  - ${file.dest}`);
    }

    conflictStrategy = await select({
      message: 'Como tratar conflitos?',
      choices: [
        { value: 'skip', name: 'Pular arquivos existentes (seguro)' },
        { value: 'overwrite', name: 'Sobrescrever arquivos existentes' },
        { value: 'backup', name: 'Renomear para .bak e sobrescrever' },
      ],
    });
  }

  console.log(`\nResumo: ${files.length} item(ns) serão processados.\n`);
  for (const file of files) {
    const marker = conflicts.some((conflict) => conflict.dest === file.dest) ? '!' : '-';
    const descriptor = file.symlink ? `${file.dest} -> ${file.symlink}` : file.dest;
    console.log(`  ${marker} ${descriptor}`);
  }

  const confirmed = await confirm({
    message: '\nConfirmar instalação?',
    default: true,
  });

  if (!confirmed) {
    console.log('\nCancelado.');
    return;
  }

  const { written, skipped } = writeFiles(files, vars, conflictStrategy);

  if (wantExtra) {
    console.log('\nBuscando catálogo opcional...');
    const catalog = await fetchExtraSkillsCatalog();

    if (catalog) {
      console.log('Catálogo externo disponível: https://skills.sh');
    } else {
      console.log('Não foi possível buscar o catálogo agora. Use manualmente:');
    }

    console.log('  - https://skills.sh');
    console.log('  - https://www.aitmpl.com/skills');
  }

  console.log('\nInstalação concluída.');
  console.log(`Arquivos criados/atualizados: ${written.length}`);

  if (skipped.length > 0) {
    console.log(`Arquivos pulados: ${skipped.length}`);
  }

  console.log('\nPróximos passos:');
  console.log('  1. Revise CLAUDE.md e AGENTS.md no projeto alvo');
  console.log('  2. Ajuste as skills e agentes gerados para o contexto do repo');
  console.log('  3. Rode o CLI que você realmente usa: claude, codex, gemini ou copilot');
}

if (isMainModule()) {
  main().catch((error) => {
    console.error('\nErro:', error.message);
    process.exit(1);
  });
}
