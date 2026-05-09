/**
 * AI Agents Starter Kit – Orchestration example with Codex CLI
 * Demonstrates use of parallel sub-agents for review and test generation.
 *
 * Note: This is a conceptual example illustrating the usage pattern.
 * The @openai/codex SDK may vary – consult the official documentation.
 */

import { execSync } from "child_process";
import * as fs from "fs";

interface AgentResult {
  task: string;
  output: string;
  success: boolean;
}

/**
 * Executes the Codex CLI with a prompt and returns the result.
 */
function runCodex(prompt: string, files: string[] = []): AgentResult {
  const filesArg = files.map((f) => `--file "${f}"`).join(" ");
  const cmd = `codex run ${filesArg} "${prompt.replace(/"/g, '\\"')}"`;

  try {
    const output = execSync(cmd, {
      encoding: "utf8",
      timeout: 60_000,
    });
    return { task: prompt, output, success: true };
  } catch (error) {
    const err = error as Error;
    return { task: prompt, output: err.message, success: false };
  }
}

/**
 * Saves result to memory (memory_log.json).
 */
function storeMemory(task: string, output: string): void {
  const memFile = "./memory_log.json";
  const entry = { task, output, timestamp: new Date().toISOString() };
  const existing = fs.existsSync(memFile)
    ? fs.readFileSync(memFile, "utf8").trim()
    : "";
  fs.appendFileSync(memFile, JSON.stringify(entry) + "\n");
  console.log(`[Memory] Result saved to ${memFile}`);
}

async function main(): Promise<void> {
  const targetFile = "./generated/queue.py";

  console.log("🤖 Code Generator Agent (Codex) starting...\n");

  // ── Sub-agent 1: Code Review ──────────────────────────────────────────
  console.log("📋 Sub-agent 1: Reviewing existing code...");
  const review = runCodex(
    "Review this Python code and identify performance and readability improvements.",
    ["./sample_input.py"]
  );
  if (review.success) {
    console.log("✔ Review completed:\n", review.output.slice(0, 200), "...\n");
    storeMemory("Code review", review.output);
  }

  // ── Sub-agent 2: Code Generation ──────────────────────────────────────
  console.log("⚙️  Sub-agent 2: Generating Queue implementation...");
  const generation = runCodex(
    "Implement a generic Queue class in Python with methods: " +
      "enqueue(item), dequeue() -> item, peek() -> item, is_empty() -> bool, size() -> int. " +
      "Use type hints and docstrings. Save to ./generated/queue.py"
  );
  if (generation.success) {
    console.log("✔ Code generated:\n", generation.output.slice(0, 200), "...\n");
    storeMemory("Queue generation", generation.output);
  }

  // ── Sub-agent 3: Test Generation ──────────────────────────────────────
  console.log("🧪 Sub-agent 3: Generating unit tests...");
  const tests = runCodex(
    "Generate complete pytest unit tests for the Queue class in ./generated/queue.py. " +
      "Cover edge cases: empty queue, single element, multiple elements.",
    [targetFile]
  );
  if (tests.success) {
    console.log("✔ Tests generated:\n", tests.output.slice(0, 200), "...\n");
    storeMemory("Queue tests", tests.output);
  }

  console.log("\n✅ Generator Agent finished! Check ./generated/");
  console.log("💎 PRO version with more agents: https://lemon.dev/pro-agents\n");
}

main().catch(console.error);
