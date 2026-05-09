"""
AI Agents Starter Kit – Simple Python agent with OpenAI API.
Demonstrates code generation via direct API (without CLI).
"""
import json
import os
from datetime import datetime
from pathlib import Path


def store_memory(task: str, output: str, mem_file: str = "./memory_log.json") -> None:
    """Saves session result to memory file."""
    entry = {
        "task": task,
        "output": output,
        "timestamp": datetime.now().isoformat(),
    }
    with open(mem_file, "a", encoding="utf-8") as f:
        json.dump(entry, f, ensure_ascii=False)
        f.write("\n")
    print(f"[Memory] Saved to {mem_file}")


def run_codex_cli(prompt: str, files: list[str] | None = None) -> str:
    """
    Executes the Codex CLI via subprocess and returns the output.
    In production, use subprocess.run with proper error handling.
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
    Generates code from a natural language description.

    Args:
        description: What the code should do.
        output_file: Path to save the generated code (optional).

    Returns:
        The generated code as a string.
    """
    print(f"\n🤖 Generating code for: {description[:60]}...")

    prompt = (
        f"Implement the following in Python with type hints and docstrings:\n\n"
        f"{description}\n\n"
        "Return only the Python code, without additional explanations."
    )

    output = run_codex_cli(prompt)

    if output_file:
        Path(output_file).parent.mkdir(parents=True, exist_ok=True)
        Path(output_file).write_text(output, encoding="utf-8")
        print(f"✔ Code saved to {output_file}")

    store_memory(f"Generation: {description}", output)
    return output


def refactor_code(file_path: str) -> str:
    """
    Refactors an existing Python file.

    Args:
        file_path: Path to the file to refactor.

    Returns:
        The refactored code.
    """
    print(f"\n🔧 Refactoring: {file_path}...")

    prompt = (
        "Refactor the following Python code to improve readability, "
        "performance, and follow best practices. Use complete type hints."
    )

    output = run_codex_cli(prompt, files=[file_path])
    store_memory(f"Refactoring: {file_path}", output)
    return output


def main() -> None:
    print("=" * 45)
    print("  Code Generator Agent (Python)")
    print("=" * 45)

    # Example 1: Generate a data structure
    queue_code = generate_code(
        description=(
            "A generic Queue class with methods: "
            "enqueue(item), dequeue() -> item, peek() -> item, "
            "is_empty() -> bool, size() -> int"
        ),
        output_file="./generated/queue.py",
    )
    print(f"\nGenerated code ({len(queue_code)} characters)")

    # Example 2: Generate tests
    test_code = generate_code(
        description="pytest unit tests for the Queue class in ./generated/queue.py",
        output_file="./generated/test_queue.py",
    )
    print(f"Generated tests ({len(test_code)} characters)")

    print("\n✅ Agent finished!")
    print("💎 PRO version: https://lemon.dev.br")


if __name__ == "__main__":
    main()
