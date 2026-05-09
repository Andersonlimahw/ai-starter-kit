import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { replacePlaceholders, getTemplateFiles, writeFiles } from '../scripts/init-ai.mjs';

const TMP_TEST_DIR = path.join(os.tmpdir(), `init-ai-tests-${Date.now()}`);

test('setup: creates temporary directory for tests', () => {
  if (fs.existsSync(TMP_TEST_DIR)) {
    fs.rmSync(TMP_TEST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TMP_TEST_DIR, { recursive: true });
});

test('replacePlaceholders replaces all occurrences', () => {
  const template = 'Project: {{PROJECT_NAME}} — stack: {{STACK}} ({{PROJECT_NAME}})';
  const vars = { PROJECT_NAME: 'my-app', STACK: 'Next.js' };
  const result = replacePlaceholders(template, vars);
  assert.equal(result, 'Project: my-app — stack: Next.js (my-app)');
});

test('replacePlaceholders does not change text without placeholders', () => {
  const template = 'Text without placeholders.';
  const result = replacePlaceholders(template, { FOO: 'bar' });
  assert.equal(result, 'Text without placeholders.');
});

test('getTemplateFiles always includes claude when selected', () => {
  const files = getTemplateFiles(['claude']);
  const dests = files.map(f => f.dest);
  assert.ok(dests.includes('CLAUDE.md'));
  assert.ok(dests.includes('AGENTS.md'));
  assert.ok(dests.includes('.claude/settings.json'));
});

test('getTemplateFiles includes codex when selected', () => {
  const files = getTemplateFiles(['claude', 'codex']);
  const dests = files.map(f => f.dest);
  assert.ok(dests.includes('.codex/settings.json'));
  assert.ok(dests.includes('.codex/commands/project-commit.md'));
});

test('getTemplateFiles does not include codex when not selected', () => {
  const files = getTemplateFiles(['claude']);
  const dests = files.map(f => f.dest);
  assert.ok(!dests.includes('.codex/settings.json'));
});

test('getTemplateFiles includes gemini when selected', () => {
  const files = getTemplateFiles(['claude', 'gemini']);
  const dests = files.map(f => f.dest);
  assert.ok(dests.includes('.gemini/skills/llm-wiki/SKILL.md'));
});

test('getTemplateFiles includes GEMINI.md as symlink', () => {
  const files = getTemplateFiles(['claude']);
  const symlink = files.find(f => f.dest === 'GEMINI.md');
  assert.ok(symlink);
  assert.equal(symlink.symlink, 'AGENTS.md');
});

test('writeFiles creates files and directories', () => {
  // We use real template files to avoid reading errors
  const files = [{ src: 'CLAUDE.md', dest: 'sub/CLAUDE.md' }];
  const vars = { PROJECT_NAME: 'Test', PROJECT_DESCRIPTION: 'Desc', LANGUAGE: 'JS', STACK: 'Node' };
  
  const { written } = writeFiles(files, vars, 'overwrite', TMP_TEST_DIR);
  
  assert.ok(written.includes('sub/CLAUDE.md'));
  assert.ok(fs.existsSync(path.join(TMP_TEST_DIR, 'sub/CLAUDE.md')));
});

test('writeFiles skips existing files with strategy "skip"', () => {
  const dest = 'exists.md';
  const fullPath = path.join(TMP_TEST_DIR, dest);
  fs.writeFileSync(fullPath, 'original', 'utf8');
  
  const files = [{ src: 'CLAUDE.md', dest }];
  const { skipped } = writeFiles(files, {}, 'skip', TMP_TEST_DIR);
  
  assert.ok(skipped.includes(dest));
  assert.equal(fs.readFileSync(fullPath, 'utf8'), 'original');
});

test('writeFiles creates backup with strategy "backup"', () => {
  const dest = 'backup-me.md';
  const fullPath = path.join(TMP_TEST_DIR, dest);
  fs.writeFileSync(fullPath, 'original', 'utf8');
  
  const files = [{ src: 'CLAUDE.md', dest }];
  writeFiles(files, { PROJECT_NAME: 'T' }, 'backup', TMP_TEST_DIR);
  
  // The backup will have a .bak extension
  assert.ok(fs.existsSync(`${fullPath}.bak`));
  assert.equal(fs.readFileSync(`${fullPath}.bak`, 'utf8'), 'original');
});

test('writeFiles creates symlinks correctly', () => {
  const files = [
    { src: 'AGENTS.md', dest: 'AGENTS.md' },
    { dest: 'LINK.md', symlink: 'AGENTS.md' }
  ];
  
  writeFiles(files, { PROJECT_NAME: 'T' }, 'overwrite', TMP_TEST_DIR);
  
  const linkPath = path.join(TMP_TEST_DIR, 'LINK.md');
  const stat = fs.lstatSync(linkPath);
  assert.ok(stat.isSymbolicLink());
  assert.equal(fs.readlinkSync(linkPath), 'AGENTS.md');
});

test('cleanup: removes temporary directory', () => {
  fs.rmSync(TMP_TEST_DIR, { recursive: true, force: true });
});
