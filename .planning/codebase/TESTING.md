# Testing Patterns

**Analysis Date:** 2026-04-14

## Test Framework

**Runner (JavaScript):**
- Node.js built-in test runner (`node:test`) — no external test library required
- Config: none (invoked directly via `node --test`)
- Assertion library: `node:assert/strict` (strict equality mode)

**Runner (Python):**
- pytest `>=8.0` (dev dependency in `pyproject.toml`)
- Config: `pyproject.toml` `[tool.pytest.ini_options]` section
- `testpaths = ["examples"]`
- `python_files = ["test_*.py", "*_test.py"]`

**Smoke Tests (Bash):**
- `scripts/test_models.sh` — verifies CLIs are installed and API keys are set
- Not an automated assertion suite; outputs pass/fail counters

**Run Commands:**
```bash
npm test                   # Run all JS tests (node --test tests/**/*.test.mjs examples/**/*.test.js)
npm run test:smoke         # Run bash smoke tests (CLI/key availability)
pytest -q                  # Run Python tests (from examples/ directory)
```

## Test File Organization

**JavaScript Location:**
- Dedicated `tests/` directory at project root: `tests/init-ai.test.mjs`
- Test file imports from source using relative paths: `../scripts/init-ai.mjs`

**Python Location:**
- Co-located in `examples/` directories (pytest `testpaths` points to `examples/`)
- Pattern: `test_*.py` or `*_test.py`

**Naming:**
- JavaScript: `<module-name>.test.mjs` (e.g., `init-ai.test.mjs`)
- Python: `test_<module>.py` or `<module>_test.py`

**Structure:**
```
tests/
└── init-ai.test.mjs    # Unit tests for scripts/init-ai.mjs

examples/
└── <example-name>/
    └── test_*.py       # Python example tests (none currently present)
```

## Test Structure

**JavaScript Suite Organization:**
```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { replacePlaceholders, getTemplateFiles, writeFiles } from '../scripts/init-ai.mjs';

// Setup test: runs first, creates shared temp dir
test('setup: cria diretório temporário para testes', () => {
  if (fs.existsSync(TMP_TEST_DIR)) {
    fs.rmSync(TMP_TEST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TMP_TEST_DIR, { recursive: true });
});

// Functional tests: one assertion per test
test('replacePlaceholders substitui todas as ocorrências', () => {
  const result = replacePlaceholders(template, vars);
  assert.equal(result, expected);
});

// Cleanup test: runs last, removes shared temp dir
test('cleanup: remove diretório temporário', () => {
  fs.rmSync(TMP_TEST_DIR, { recursive: true, force: true });
});
```

**Patterns:**
- Flat list of `test()` calls — no `describe()` nesting
- Setup done in a named test (`'setup: ...'`) that runs first sequentially
- Cleanup done in a named test (`'cleanup: ...'`) that runs last
- One logical assertion per test case
- Test names written in Portuguese

## Mocking

**Framework:** None. No mocking library is used.

**Patterns:**
- Real filesystem operations via `os.tmpdir()` temporary directories:
```javascript
const TMP_TEST_DIR = path.join(os.tmpdir(), `init-ai-tests-${Date.now()}`);

// Pass targetDir to function under test instead of relying on global TARGET_DIR
const { written } = writeFiles(files, vars, 'overwrite', TMP_TEST_DIR);
```

- Functions designed to accept injectable `targetDir` parameter for testability:
```javascript
export function writeFiles(files, vars, conflictStrategy = 'skip', targetDir = TARGET_DIR) {
  // targetDir defaults to process.cwd() but can be overridden in tests
}
```

- No HTTP mocking — `fetchExtraSkillsCatalog` is not covered by unit tests (network call)
- No `execSync` mocking — `detectCli` is not covered by unit tests

**What to Mock:**
- Network calls (`fetchExtraSkillsCatalog`) when testing `main()` — currently untested
- Interactive prompts (`@inquirer/prompts`) when testing `main()` — currently untested

**What NOT to Mock:**
- Filesystem operations — tests use real temp directories, which provides integration confidence

## Fixtures and Factories

**Test Data:**
```javascript
// Inline data directly in each test
const template = 'Projeto: {{PROJECT_NAME}} — stack: {{STACK}} ({{PROJECT_NAME}})';
const vars = { PROJECT_NAME: 'meu-app', STACK: 'Next.js' };

// Real template files used as fixtures (read from templates/ dir at test time)
const files = [{ src: 'CLAUDE.md', dest: 'sub/CLAUDE.md' }];
const vars = { PROJECT_NAME: 'Test', PROJECT_DESCRIPTION: 'Desc', LANGUAGE: 'JS', STACK: 'Node' };
writeFiles(files, vars, 'overwrite', TMP_TEST_DIR);
```

**Location:**
- No dedicated fixtures directory
- Inline test data in test file
- Real files from `templates/` directory used as test input data

## Coverage

**Requirements:** None enforced. No coverage thresholds configured.

**View Coverage:**
```bash
node --test --experimental-test-coverage tests/**/*.test.mjs
```
(Not in any npm script — must be run manually.)

## Test Types

**Unit Tests:**
- `tests/init-ai.test.mjs` tests pure functions (`replacePlaceholders`, `getTemplateFiles`) and file I/O functions (`writeFiles`) in isolation
- Scope: individual exported functions from `scripts/init-ai.mjs`

**Integration Tests:**
- `writeFiles` tests exercise real filesystem in temp directory — borderline unit/integration
- No explicit integration test suite

**E2E Tests:**
- `scripts/test_models.sh` performs smoke-level E2E: checks CLI availability and API key presence
- Not automated assertions; manual inspection required
- Run with: `npm run test:smoke`

## Common Patterns

**Filesystem State Testing:**
```javascript
// Write a file, call function, assert result
const dest = 'exists.md';
const fullPath = path.join(TMP_TEST_DIR, dest);
fs.writeFileSync(fullPath, 'original', 'utf8');

const files = [{ src: 'CLAUDE.md', dest }];
const { skipped } = writeFiles(files, {}, 'skip', TMP_TEST_DIR);

assert.ok(skipped.includes(dest));
assert.equal(fs.readFileSync(fullPath, 'utf8'), 'original');
```

**Symlink Testing:**
```javascript
const linkPath = path.join(TMP_TEST_DIR, 'LINK.md');
const stat = fs.lstatSync(linkPath);
assert.ok(stat.isSymbolicLink());
assert.equal(fs.readlinkSync(linkPath), 'AGENTS.md');
```

**Array Membership Assertions:**
```javascript
// Use assert.ok with includes() — preferred over assert.deepEqual for partial checks
const dests = files.map(f => f.dest);
assert.ok(dests.includes('CLAUDE.md'));
assert.ok(!dests.includes('.codex/settings.json'));
```

**Error Testing:**
- Not demonstrated in current test suite. No tests for thrown errors.

---

*Testing analysis: 2026-04-14*
