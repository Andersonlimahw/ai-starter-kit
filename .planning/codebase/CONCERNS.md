# Codebase Concerns

**Analysis Date:** 2026-04-14

## Tech Debt

**`--add-skill` mode uses mock download instead of real fetch:**
- Issue: `handleAddSkillMode()` in `scripts/init-ai.mjs` (line 287) never actually downloads skill content from the URL in the catalog entry. It constructs a hardcoded stub string with `(Conteúdo baixado de ${skill.url})` instead of calling `fetch(skill.url)`. The feature is labeled "community skills installer" but delivers no real skill content.
- Files: `scripts/init-ai.mjs` lines 285–291
- Impact: Users who run `--add-skill` get placeholder markdown files, not real skills. The entire `--add-skill` command surface is functionally incomplete.
- Fix approach: Replace the mock block with `const res = await fetch(skill.url, { signal: AbortSignal.timeout(5000) }); const content = res.ok ? await res.text() : fallback;`

**`fetchExtraSkillsCatalog` targets a 404 endpoint:**
- Issue: `scripts/init-ai.mjs` line 116 calls `https://skills.sh/api/catalog`. The URL exists as a Next.js route but returns HTTP 404 (confirmed). The function silently returns `null` on failure, so the main flow falls back to the mock skills list (`mockSkills`) without telling the user what was attempted.
- Files: `scripts/init-ai.mjs` lines 114–128, 222–232
- Impact: The "consult external catalog" feature never delivers real catalog data. User sees "Aviso: Usando catálogo offline de exemplo." on every run.
- Fix approach: Either build the `/api/catalog` endpoint on skills.sh to return the expected `{ skills: [...] }` JSON, or change the URL to a working endpoint, or remove the network call until the endpoint exists.

**No ESLint config file present:**
- Issue: `package.json` defines a `lint` script (`eslint . --ext .js,.ts,.mjs`) but no ESLint config file exists at the project root (no `.eslintrc*`, no `eslint.config.*`). ESLint 9 requires a flat config (`eslint.config.mjs`) by default and will error or lint nothing without it.
- Files: `package.json` (scripts.lint), project root
- Impact: `npm run lint` fails silently or errors out. The CI step "Lint JavaScript/TypeScript" runs `npm run lint --if-present || echo "Sem erros..."` which swallows the failure. Code style is not enforced.
- Fix approach: Add `eslint.config.mjs` with at minimum `import js from "@eslint/js"; export default [js.configs.recommended];`.

**`plan.md` and `plan.checklist.md` committed to main branch:**
- Issue: `.gitignore` lists `plan.md` (ignores it), yet `plan.checklist.md` is not ignored and is committed. `plan.md` is also present on disk (not tracked per gitignore), indicating .gitignore was added after the file was already committed or it was removed later. Planning artifacts are not development-time artifacts.
- Files: `plan.checklist.md`, `.gitignore`
- Impact: Repository noise; planning docs visible to downstream users who clone the kit.
- Fix approach: Add `plan.checklist.md` to `.gitignore` and remove it from tracking with `git rm --cached plan.checklist.md`.

**`getTemplateFiles` always forces `claude` into selected CLIs, ignoring user deselection:**
- Issue: `scripts/init-ai.mjs` line 81 does `const selected = new Set(['claude', ...clis])` and line 358 does `const clis = Array.from(new Set(['claude', ...selectedClis]))`. If the user explicitly unchecks Claude in the interactive prompt, Claude files are still installed. This is silent and undocumented.
- Files: `scripts/init-ai.mjs` lines 81–85, 358
- Impact: Unexpected files written to user repositories; breaks the promise of the checkbox UI.
- Fix approach: Document the constraint clearly in the prompt label (e.g. "Claude Code [obrigatório]") or remove the forced inclusion if the user deselects.

## Known Bugs

**`hook-before-edit.sh` has broken conditional logic for ESLint detection:**
- Symptoms: The ESLint block either always runs or never runs correctly.
- Files: `scripts/hook-before-edit.sh` line 10
- Trigger: The condition `command -v npx >/dev/null 2>&1 && [ -f ".eslintrc*" ] || [ -f "eslint.config.*" ]` has two bugs: (1) `[ -f ".eslintrc*" ]` does not expand globs — it checks for a file literally named `.eslintrc*`, which never exists; (2) operator precedence means `|| [ -f "eslint.config.*" ]` is evaluated independently of the `&&`, so the ESLint block runs whenever a file named `eslint.config.*` exists, regardless of whether `npx` is installed. The `2>/dev/null` after the second test is also a no-op since it applies to nothing.
- Workaround: None; the hook either skips ESLint when it should run it, or runs it unconditionally.
- Fix approach: Replace with `if command -v npx >/dev/null 2>&1 && (ls .eslintrc* eslint.config.* 2>/dev/null | grep -q .); then`.

**`processar_pedidos` in example code crashes with `UnboundLocalError`:**
- Symptoms: `examples/depurador-claude/sample_bug.py` line 27 references `total` before assignment inside a loop.
- Files: `examples/depurador-claude/sample_bug.py` lines 23–28
- Trigger: Calling `processar_pedidos([{"valor": 10}])` raises `UnboundLocalError: local variable 'total' referenced before assignment`.
- Workaround: This is intentional — the file is a debugging exercise. However, running `pytest` against the `examples/` directory (as configured in `pyproject.toml`) will pick up this file and may fail if any test imports it. The pytest config `testpaths = ["examples"]` scans for `test_*.py` files so this specific file is not collected, but the risk remains if future test files are added nearby.

**`test` script glob may not expand correctly on all shells:**
- Symptoms: `"test": "node --test tests/**/*.test.mjs examples/**/*.test.js 2>/dev/null || echo 'No tests found'"` — glob expansion behavior of `**` is shell-dependent when run via `npm run`. On npm's bundled shell (sh), `**` is not recursive. Only `tests/init-ai.test.mjs` is currently in scope, so this is benign today but will silently miss future test files added in nested directories.
- Files: `package.json` scripts.test
- Fix approach: Use `node --test $(find tests -name '*.test.mjs') 2>/dev/null` or switch to a test runner (vitest, jest) with built-in glob handling.

## Security Considerations

**Shell injection risk in `codex-agent.ts` `runCodex` function:**
- Risk: `examples/gerador-codex/codex-agent.ts` line 23 builds a shell command by string interpolation: `` const cmd = `codex run ${filesArg} "${prompt.replace(/"/g, '\\"')}"` ``. The `filesArg` is constructed from the `files` array using template literals without any sanitization of path characters. A file path containing shell metacharacters (backtick, `$`, `;`, `|`) would be executed. Additionally, `prompt.replace(/"/g, '\\"')` only escapes double quotes — single quotes, backticks, and `$()` in prompts remain dangerous.
- Files: `examples/gerador-codex/codex-agent.ts` lines 21–28
- Current mitigation: None. The example is marked "conceitual" in comments but is runnable code.
- Recommendations: Use `execSync` with the `args` array form instead of shell string construction, or use `spawnSync` with `shell: false`. This is an example file but establishes a dangerous pattern users may copy.

**`setup.sh` pipes curl output directly to bash:**
- Risk: `scripts/setup.sh` line 31 runs `curl -fsSL https://claude.ai/install.sh | bash`. This pattern executes arbitrary code from a remote URL with no integrity check (no checksum, no GPG verification).
- Files: `scripts/setup.sh` line 31
- Current mitigation: The `-f` flag causes curl to fail on HTTP errors. No other mitigation.
- Recommendations: Add a SHA256 checksum verification step, or document the risk explicitly in README so users can review the install script before running. Alternatively, prefer `npm install -g @anthropic-ai/claude-code` if that package exists.

**`.env.example` has no actual variable names defined:**
- Risk: The `.env.example` file contains only section comments and no `VAR_NAME=` entries (confirmed by inspection — all lines are either comments or blank). Users have no reference for which variable names to set, and `test_models.sh` checks for `CLAUDE_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `GITHUB_TOKEN` — none of which appear in `.env.example`.
- Files: `.env.example`, `scripts/test_models.sh` lines 69–72
- Current mitigation: None.
- Recommendations: Populate `.env.example` with `CLAUDE_API_KEY=`, `OPENAI_API_KEY=`, `GEMINI_API_KEY=`, `GITHUB_TOKEN=` with empty values and comments explaining where to get each key.

## Performance Bottlenecks

**`detectCli` calls `execSync` per CLI synchronously during startup:**
- Problem: `scripts/init-ai.mjs` `getDetectedClis()` (line 202) calls `detectCli` four times sequentially inside `main()`. Each call runs an `execSync` shell subprocess (`which`/`where`). These are fast operations but run synchronously and block the event loop while the user waits for the first prompt.
- Files: `scripts/init-ai.mjs` lines 104–112, 202–209
- Cause: `detectCli` uses `execSync` (blocking) rather than `exec` (async).
- Improvement path: Use `Promise.all([detectCli('claude'), ...])` with an async version using `exec` from `child_process`. Minor UX improvement, not a critical path issue.

## Fragile Areas

**`writeSymlink` silently swallows errors during destination cleanup:**
- Files: `scripts/init-ai.mjs` lines 153–168
- Why fragile: The `try/catch` block around `fs.unlinkSync` / `fs.rmSync` catches all errors including permission denied or files locked by other processes, then proceeds to attempt `fs.symlinkSync` which will fail with a less informative error. The comment "O destino pode ainda não existir; seguimos para criar o link" is misleading — the catch also hides real filesystem errors.
- Safe modification: Add error type checking: only suppress `ENOENT` errors, re-throw others.
- Test coverage: `tests/init-ai.test.mjs` covers symlink creation success but does not test failure scenarios (permission denied, existing directory that cannot be removed).

**`backupPathFor` could loop infinitely on filesystem with permission issues:**
- Files: `scripts/init-ai.mjs` lines 130–139
- Why fragile: The while loop calls `fs.existsSync(candidate)` repeatedly until a free name is found. If the directory is not readable (permissions) or some other I/O error occurs, `existsSync` will throw (it uses `lstatSync` internally in older Node versions) or return `false` unexpectedly. There is also no maximum iteration cap.
- Safe modification: Add a counter limit (e.g., max 100 backups) and surface an error if exceeded.
- Test coverage: Only the happy path (one `.bak` creation) is tested.

**`handleAddSkillMode` has no test coverage:**
- Files: `scripts/init-ai.mjs` lines 215–294
- Why fragile: The entire `--add-skill` execution path is untested. It has interactive prompts, filesystem writes, and a network call, none of which have corresponding tests in `tests/init-ai.test.mjs`.
- Safe modification: Extract the installable logic (directory creation + file writing per skill) into a named exported function similar to `writeFiles`, then test it in isolation.
- Test coverage: Zero. All 11 tests in `tests/init-ai.test.mjs` cover only `replacePlaceholders`, `getTemplateFiles`, and `writeFiles`.

## Scaling Limits

**No rate limiting or retry logic on `fetchExtraSkillsCatalog`:**
- Current capacity: Single fetch with 5-second timeout, no retry.
- Limit: If skills.sh is slow or flaky, the entire `--add-skill` flow degrades silently to the mock skills list with no user indication of the failure reason (just "Aviso: Usando catálogo offline de exemplo.").
- Scaling path: Implement exponential backoff with 2–3 retries, or cache the catalog locally with a TTL.

## Dependencies at Risk

**`@inquirer/prompts` pinned at `^7.0.0` — major version drift risk:**
- Risk: The package is a `devDependency` but is required at runtime (imported in `scripts/init-ai.mjs`). If it is not installed (e.g., user clones and runs without `npm install`), the script throws a catchable error with a helpful message. However, placing a runtime interactive dependency in `devDependencies` means `npm install --production` skips it, breaking the tool entirely.
- Impact: `npm run init-ai` fails with "Dependência @inquirer/prompts indisponível" if installed in production mode.
- Migration plan: Move `@inquirer/prompts` to `dependencies` (not `devDependencies`).

**`eslint` in `devDependencies` but no config — unusable as-is:**
- Risk: ESLint 9.x is present but without a config file it cannot lint anything. The version `^9.0.0` uses flat config by default and won't fall back to legacy config search.
- Impact: `npm run lint` fails. CI lint step is a no-op (masked by `|| echo`).
- Migration plan: Add `eslint.config.mjs` or downgrade to ESLint 8 with `.eslintrc.json`.

## Missing Critical Features

**No TypeScript compiler or tsconfig.json:**
- Problem: `examples/gerador-codex/codex-agent.ts` is a TypeScript file, but there is no `tsconfig.json`, no `tsc` in dependencies, and no build script to compile it. The file cannot be run directly with Node.js.
- Blocks: Users cannot execute `codex-agent.ts` without manually installing TypeScript or using `ts-node`/`tsx`. The example is effectively non-runnable as delivered.

**No `.planning/` in `.gitignore`:**
- Problem: The `.planning/codebase/` directory (where these analysis documents live) is not excluded by `.gitignore`. If committed, internal planning documents become part of the public repository.
- Files: `.gitignore`
- Recommendation: Add `.planning/` to `.gitignore` if these documents are meant to be local only.

## Test Coverage Gaps

**`detectCli` is not tested:**
- What's not tested: The function that detects installed CLIs via shell subprocess is entirely untested.
- Files: `scripts/init-ai.mjs` lines 104–112
- Risk: Breakage on Windows (uses `where` vs `which`) or unusual PATH configurations would go undetected.
- Priority: Low (platform detection is hard to unit-test portably)

**`writeFiles` with `overwrite` conflict strategy is not tested:**
- What's not tested: The overwrite path (no backup, just write over existing file) has no dedicated test case. Only `skip` and `backup` strategies are tested.
- Files: `tests/init-ai.test.mjs`, `scripts/init-ai.mjs` lines 170–200
- Risk: A regression in overwrite logic would not be caught.
- Priority: Medium

**`handleAddSkillMode` entirely untested:**
- What's not tested: Interactive skill install flow — catalog fetch fallback, skill directory creation, file write, overwrite confirmation prompt.
- Files: `scripts/init-ai.mjs` lines 215–294
- Risk: Any bug in the `--add-skill` path is invisible until a user reports it.
- Priority: High (it is the most recently added feature and the most complex interactive path)

**No integration test for the full `main()` scaffold flow:**
- What's not tested: The end-to-end `main()` function that asks prompts, resolves conflicts, calls `writeFiles`, and optionally fetches the catalog.
- Files: `scripts/init-ai.mjs` lines 296–435
- Risk: Regression in prompt wiring or variable passing to templates would not be caught.
- Priority: Medium

---

*Concerns audit: 2026-04-14*
