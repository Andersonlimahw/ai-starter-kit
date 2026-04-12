/**
 * AI Agents Starter Kit – Exemplo de orquestração com Codex CLI
 * Demonstra uso de sub-agentes paralelos para revisão e geração de testes.
 *
 * Nota: Este é um exemplo conceitual que ilustra o padrão de uso.
 * O SDK @openai/codex pode variar – consulte a documentação oficial.
 */

import { execSync } from "child_process";
import * as fs from "fs";

interface AgentResult {
  task: string;
  output: string;
  success: boolean;
}

/**
 * Executa o Codex CLI com um prompt e retorna o resultado.
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
 * Salva resultado em memória (memory_log.json).
 */
function storeMemory(task: string, output: string): void {
  const memFile = "./memory_log.json";
  const entry = { task, output, timestamp: new Date().toISOString() };
  const existing = fs.existsSync(memFile)
    ? fs.readFileSync(memFile, "utf8").trim()
    : "";
  fs.appendFileSync(memFile, JSON.stringify(entry) + "\n");
  console.log(`[Memória] Resultado salvo em ${memFile}`);
}

async function main(): Promise<void> {
  const targetFile = "./generated/queue.py";

  console.log("🤖 Agente Gerador de Código (Codex) iniciando...\n");

  // ── Sub-agente 1: Revisão de código ──────────────────────────────────────
  console.log("📋 Sub-agente 1: Revisando código existente...");
  const review = runCodex(
    "Revise este código Python e identifique melhorias de performance e legibilidade.",
    ["./sample_input.py"]
  );
  if (review.success) {
    console.log("✔ Revisão concluída:\n", review.output.slice(0, 200), "...\n");
    storeMemory("Revisão de código", review.output);
  }

  // ── Sub-agente 2: Geração de código ──────────────────────────────────────
  console.log("⚙️  Sub-agente 2: Gerando implementação de Queue...");
  const generation = runCodex(
    "Implemente uma classe Queue genérica em Python com métodos: " +
      "enqueue(item), dequeue() -> item, peek() -> item, is_empty() -> bool, size() -> int. " +
      "Use type hints e docstrings. Salve em ./generated/queue.py"
  );
  if (generation.success) {
    console.log("✔ Código gerado:\n", generation.output.slice(0, 200), "...\n");
    storeMemory("Geração de Queue", generation.output);
  }

  // ── Sub-agente 3: Geração de testes ──────────────────────────────────────
  console.log("🧪 Sub-agente 3: Gerando testes unitários...");
  const tests = runCodex(
    "Gere testes unitários pytest completos para a classe Queue em ./generated/queue.py. " +
      "Cubra casos de borda: fila vazia, único elemento, múltiplos elementos.",
    [targetFile]
  );
  if (tests.success) {
    console.log("✔ Testes gerados:\n", tests.output.slice(0, 200), "...\n");
    storeMemory("Testes de Queue", tests.output);
  }

  console.log("\n✅ Agente Gerador finalizado! Verifique ./generated/");
  console.log("💎 Versão PRO com mais agentes: https://lemon.dev/pro-agents\n");
}

main().catch(console.error);
