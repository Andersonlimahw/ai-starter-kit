#!/usr/bin/env python3
"""
AI Agents Starter Kit – Python Setup Script
Configura o ambiente Python necessário para os exemplos do kit.
"""
import os
import subprocess
import sys


def run(cmd: list[str], check: bool = True) -> int:
    """Executa um comando e retorna o código de saída."""
    print(f"  → {' '.join(cmd)}")
    result = subprocess.run(cmd, check=False)
    if check and result.returncode != 0:
        print(f"  ✗ Falhou com código {result.returncode}")
        sys.exit(result.returncode)
    return result.returncode


def main() -> None:
    print()
    print("═" * 45)
    print("  AI Agents Starter Kit – Python Setup")
    print("═" * 45)
    print()

    # Verificar versão do Python
    major, minor = sys.version_info.major, sys.version_info.minor
    if major < 3 or (major == 3 and minor < 10):
        print(f"✗ Python >= 3.10 necessário. Versão atual: {major}.{minor}")
        sys.exit(1)
    print(f"✔ Python {major}.{minor} detectado.")

    # Instalar dependências de desenvolvimento
    print()
    print("Instalando dependências de desenvolvimento...")
    run([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
    run([sys.executable, "-m", "pip", "install", "pytest>=8.0", "flake8>=7.0", "black>=24.0"])
    print("✔ Dependências instaladas!")

    # Verificar requirements.txt (opcional)
    if os.path.exists("requirements.txt"):
        print()
        print("Instalando requirements.txt...")
        run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✔ requirements.txt instalado!")
    else:
        print("ℹ  requirements.txt não encontrado – pulando.")

    print()
    print("═" * 45)
    print("✔ Ambiente Python pronto!")
    print("  Execute os testes com: pytest -q")
    print("═" * 45)
    print()


if __name__ == "__main__":
    main()
