#!/usr/bin/env node
/**
 * init-ai — AI Agent Scaffold Generator
 * Generates AI agents infrastructure in any repository.
 * Usage: node scripts/init-ai.mjs
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
      `Dependency @inquirer/prompts unavailable. Run "npm install" before using init-ai. Detail: ${cause}`
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

function getFilesRecursively(dir, base = '') {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = path.join(base, entry.name);
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push(...getFilesRecursively(fullPath, relativePath));
    } else {
      result.push(relativePath);
    }
  }

  return result;
}

export function getTemplateFiles(clis = []) {
  const selected = new Set(['claude', ...clis]);
  const files = [...BASE_FILES];

  const cliToFolder = {
    claude: '.claude',
    codex: '.codex',
    gemini: '.gemini',
    copilot: '.agent',
  };

  for (const cli of selected) {
    const folder = cliToFolder[cli];
    if (!folder) continue;

    const folderPath = path.join(TEMPLATES_DIR, folder);
    if (fs.existsSync(folderPath)) {
      const paths = getFilesRecursively(folderPath, folder);
      for (const p of paths) {
        // Ignore unwanted files if any (e.g., .DS_Store)
        if (p.includes('.DS_Store')) continue;

        const isExecutable = p.endsWith('.sh');
        files.push({
          src: p,
          dest: p,
          executable: isExecutable,
        });
      }
    }
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
      // Destination might not exist yet; we continue to create the link.
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

async function handleUpdateMode() {
  const { select, confirm } = await loadPrompts();

  console.log('\nAI Agent Scaffold Updater');
  console.log('='.repeat(40));
  console.log(`Destination: ${TARGET_DIR}\n`);

  const detected = getDetectedClis();
  const installedClis = Object.entries(detected)
    .filter(([, found]) => found)
    .map(([name]) => name);

  const clis = installedClis.length > 0 ? installedClis : ['claude'];

  const conflictStrategy = await select({
    message: 'How to handle existing files during the update?',
    choices: [
      { value: 'backup', name: 'Create .bak and overwrite (recommended)' },
      { value: 'overwrite', name: 'Overwrite directly' },
      { value: 'skip', name: 'Skip existing files (partial update)' },
    ],
  });

  const confirmed = await confirm({
    message: `Update scaffold for ${clis.join(', ')} with strategy "${conflictStrategy}"?`,
    default: true,
  });

  if (!confirmed) {
    console.log('\nCancelled.');
    return;
  }

  const vars = {
    PROJECT_NAME: path.basename(TARGET_DIR),
    PROJECT_DESCRIPTION: 'Project with AI agents support',
    LANGUAGE: 'TypeScript',
    STACK: 'TypeScript',
  };

  const files = getTemplateFiles(clis);
  const { written, skipped } = writeFiles(files, vars, conflictStrategy);

  console.log('\nUpdate completed.');
  console.log(`Files updated: ${written.length}`);
  if (skipped.length > 0) {
    console.log(`Files skipped: ${skipped.length}`);
  }
}

async function handleAddSkillMode() {
  const { select, checkbox, confirm } = await loadPrompts();

  console.log('\nAI Agent Skill Installer (Community)');
  console.log('='.repeat(40));

  console.log('\nFetching skills catalog...');
  const catalog = await fetchExtraSkillsCatalog();

  const mockSkills = [
    {
      id: 'semantic-commit',
      name: 'Semantic Commit',
      description: 'Conventional commits with scope, breaking changes, and automatic changelog',
      url: 'https://raw.githubusercontent.com/lemondev/ai-agents-starter-kit/main/templates/.claude/skills/semantic-commit/SKILL.md',
    },
    {
      id: 'code-review',
      name: 'Code Review',
      description: 'Structured PR review: security, performance, readability',
      url: 'https://raw.githubusercontent.com/lemondev/ai-agents-starter-kit/main/templates/.claude/skills/code-review/SKILL.md',
    },
    {
      id: 'debug-workflow',
      name: 'Debug Workflow',
      description: 'Systematic debugging with hypotheses, evidence, and root cause analysis',
      url: 'https://raw.githubusercontent.com/lemondev/ai-agents-starter-kit/main/templates/.claude/skills/debug-workflow/SKILL.md',
    },
    {
      id: 'llm-wiki',
      name: 'LLM Wiki',
      description: 'Quick reference for LLM concepts: tokens, temperature, RAG, fine-tuning',
      url: 'https://raw.githubusercontent.com/lemondev/ai-agents-starter-kit/main/templates/.claude/skills/llm-wiki/SKILL.md',
    },
    {
      id: 'test-driven',
      name: 'Test-Driven Development',
      description: 'TDD with Red-Green-Refactor, mocks, fixtures, and minimum coverage',
      url: 'https://raw.githubusercontent.com/lemondev/ai-agents-starter-kit/main/templates/.claude/skills/test-driven/SKILL.md',
    },
    {
      id: 'api-design',
      name: 'API Design',
      description: 'REST best practices: versioning, errors, pagination, authentication',
      url: 'https://raw.githubusercontent.com/lemondev/ai-agents-starter-kit/main/templates/.claude/skills/api-design/SKILL.md',
    },
  ];

  const skills = catalog?.skills || mockSkills;

  if (!catalog) {
    console.log('Warning: Using offline example catalog.');
  }

  const selectedSkills = await checkbox({
    message: 'Select the skills you want to install:',
    choices: skills.map(s => ({
      name: `${s.name} - ${s.description}`,
      value: s
    }))
  });

  if (selectedSkills.length === 0) {
    console.log('\nNo skills selected.');
    return;
  }

  const targetCli = await select({
    message: 'For which CLI do you want to install?',
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

  console.log(`\nInstalling ${selectedSkills.length} skill(s) in ${baseDir}...`);

  for (const skill of selectedSkills) {
    const skillDir = path.join(TARGET_DIR, baseDir, skill.id);
    const destPath = path.join(skillDir, 'SKILL.md');

    if (fs.existsSync(destPath)) {
      const overwrite = await confirm({
        message: `Skill "${skill.name}" already exists. Overwrite?`,
        default: false
      });
      if (!overwrite) {
        console.log(`  - Skipped ${skill.name}`);
        continue;
      }
    }

    fs.mkdirSync(skillDir, { recursive: true });

    let content;
    try {
      const res = await fetch(skill.url, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        content = await res.text();
      } else {
        content = `# ${skill.name}\n\n${skill.description}\n\n> Download failed (HTTP ${res.status}). Check: ${skill.url}\n`;
      }
    } catch (err) {
      content = `# ${skill.name}\n\n${skill.description}\n\n> Download failed: ${err.message}. Check: ${skill.url}\n`;
    }
    fs.writeFileSync(destPath, content, 'utf8');
    console.log(`  + Installed: ${skill.name}`);
  }

  console.log('\nSuccessfully finished.');
}

export async function main() {
  if (process.argv.includes('--add-skill')) {
    await handleAddSkillMode();
    return;
  }

  if (process.argv.includes('--update')) {
    await handleUpdateMode();
    return;
  }

  const { input, select, checkbox, confirm } = await loadPrompts();

  console.log('\nAI Agent Scaffold Generator');
  console.log('='.repeat(40));
  console.log(`Destination: ${TARGET_DIR}\n`);

  const projectName = await input({
    message: 'Project name:',
    default: path.basename(TARGET_DIR),
  });

  const description = await input({
    message: 'Short description:',
    default: 'Project with AI agents support',
  });

  const language = await select({
    message: 'Main language:',
    choices: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust', 'Other'].map((value) => ({
      value,
      name: value,
    })),
  });

  const stack = await input({
    message: 'Stack/frameworks (optional):',
    default: language,
  });

  const detected = getDetectedClis();
  const selectedClis = await checkbox({
    message: 'Which AI CLIs do you use? (space to mark)',
    choices: [
      {
        name: `Claude Code [recommended${detected.claude ? ' | installed' : ''}]`,
        value: 'claude',
        checked: true,
      },
      {
        name: `OpenAI Codex CLI${detected.codex ? ' | installed' : ''}`,
        value: 'codex',
        checked: detected.codex,
      },
      {
        name: `Gemini CLI${detected.gemini ? ' | installed' : ''}`,
        value: 'gemini',
        checked: detected.gemini,
      },
      {
        name: `GitHub Copilot CLI${detected.copilot ? ' | installed' : ''}`,
        value: 'copilot',
        checked: detected.copilot,
      },
    ],
  });

  const clis = Array.from(new Set(['claude', ...selectedClis]));
  const wantExtra = await confirm({
    message: 'Consult optional external skills catalog (skills.sh/aitmpl.com)?',
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
    console.log(`\n${conflicts.length} file(s) already exist at the destination:`);
    for (const file of conflicts) {
      console.log(`  - ${file.dest}`);
    }

    conflictStrategy = await select({
      message: 'How to handle conflicts?',
      choices: [
        { value: 'skip', name: 'Skip existing files (safe)' },
        { value: 'overwrite', name: 'Overwrite existing files' },
        { value: 'backup', name: 'Rename to .bak and overwrite' },
      ],
    });
  }

  console.log(`\nSummary: ${files.length} item(s) will be processed.\n`);
  for (const file of files) {
    const marker = conflicts.some((conflict) => conflict.dest === file.dest) ? '!' : '-';
    const descriptor = file.symlink ? `${file.dest} -> ${file.symlink}` : file.dest;
    console.log(`  ${marker} ${descriptor}`);
  }

  const confirmed = await confirm({
    message: '\nConfirm installation?',
    default: true,
  });

  if (!confirmed) {
    console.log('\nCancelled.');
    return;
  }

  const { written, skipped } = writeFiles(files, vars, conflictStrategy);

  if (wantExtra) {
    console.log('\nFetching optional catalog...');
    const catalog = await fetchExtraSkillsCatalog();

    if (catalog) {
      console.log('External catalog available: https://skills.sh');
    } else {
      console.log('Could not fetch the catalog now. Use manually:');
    }

    console.log('  - https://skills.sh');
    console.log('  - https://www.aitmpl.com/skills');
  }

  console.log('\nInstallation completed.');
  console.log(`Files created/updated: ${written.length}`);

  if (skipped.length > 0) {
    console.log(`Files skipped: ${skipped.length}`);
  }

  console.log('\nNext steps:');
  console.log('  1. Review CLAUDE.md and AGENTS.md in the target project');
  console.log('  2. Adjust the generated skills and agents to the repo context');
  console.log('  3. Run the CLI you actually use: claude, codex, gemini or copilot');
}

if (isMainModule()) {
  main().catch((error) => {
    console.error('\nError:', error.message);
    process.exit(1);
  });
}
