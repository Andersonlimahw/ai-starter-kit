"""
AI Agents Starter Kit – Agente Python simples com OpenAI API.
Demonstra geração de código via API direta (sem CLI).
"""
import json
import os
from datetime import datetime
from pathlib import Path


def store_memory(task: str, output: str, mem_file: str = "./memory_log.json") -> None:
    """Salva resultado da sessão no arquivo de memória."""
    entry = {
        "task": task,
        "output": output,
        "timestamp": datetime.now().isoformat(),
    }
    with open(mem_file, "a", encoding="utf-8") as f:
        json.dump(entry, f, ensure_ascii=False)
        f.write("\n")
    print(f"[Memória] Salvo em {mem_file}")


def run_codex_cli(prompt: str, files: list[str] | None = None) -> str:
    """
    Executa o Codex CLI via subprocess e retorna a saída.
    Em produção, use subprocess.run com tratamento de erros adequado.
    """
    import subprocess

    cmd = ["codex", "run", prompt]
    if files:
        for f in files:
            cmd.extend(["--file", f])

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=60,
    )
    return result.stdout if result.returncode == 0 else result.stderr


def generate_code(description: str, output_file: str | None = None) -> str:
    """
    Gera código a partir de uma descrição em linguagem natural.

    Args:
        description: O que o código deve fazer.
        output_file: Caminho para salvar o código gerado (opcional).

    Returns:
        O código gerado como string.
    """
    print(f"\n🤖 Gerando código para: {description[:60]}...")

    prompt = (
        f"Implemente o seguinte em Python com type hints e docstrings:\n\n"
        f"{description}\n\n"
        "Retorne apenas o código Python, sem explicações adicionais."
    )

    output = run_codex_cli(prompt)

    if output_file:
        Path(output_file).parent.mkdir(parents=True, exist_ok=True)
        Path(output_file).write_text(output, encoding="utf-8")
        print(f"✔ Código salvo em {output_file}")

    store_memory(f"Geração: {description}", output)
    return output


def refactor_code(file_path: str) -> str:
    """
    Refatora um arquivo Python existente.

    Args:
        file_path: Caminho para o arquivo a refatorar.

    Returns:
        O código refatorado.
    """
    print(f"\n🔧 Refatorando: {file_path}...")

    prompt = (
        "Refatore o seguinte código Python para melhorar legibilidade, "
        "performance e seguir boas práticas. Use type hints completos."
    )

    output = run_codex_cli(prompt, files=[file_path])
    store_memory(f"Refatoração: {file_path}", output)
    return output


def main() -> None:
    print("=" * 45)
    print("  Agente Gerador de Código (Python)")
    print("=" * 45)

    # Exemplo 1: Gerar uma estrutura de dados
    queue_code = generate_code(
        description=(
            "Uma classe Queue genérica com métodos: "
            "enqueue(item), dequeue() -> item, peek() -> item, "
            "is_empty() -> bool, size() -> int"
        ),
        output_file="./generated/queue.py",
    )
    print(f"\nCódigo gerado ({len(queue_code)} caracteres)")

    # Exemplo 2: Gerar testes
    test_code = generate_code(
        description="Testes unitários pytest para a classe Queue em ./generated/queue.py",
        output_file="./generated/test_queue.py",
    )
    print(f"Testes gerados ({len(test_code)} caracteres)")

    print("\n✅ Agente finalizado!")
    print("💎 Versão PRO: https://lemon.dev/pro-agents")


if __name__ == "__main__":
    main()
