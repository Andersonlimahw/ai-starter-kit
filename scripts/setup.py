#!/usr/bin/env python3
"""
AI Agents Starter Kit – Python Setup Script
Configures the Python environment required for the kit's examples.
"""
import os
import subprocess
import sys


def run(cmd: list[str], check: bool = True) -> int:
    """Executes a command and returns the exit code."""
    print(f"  → {' '.join(cmd)}")
    result = subprocess.run(cmd, check=False)
    if check and result.returncode != 0:
        print(f"  ✗ Failed with code {result.returncode}")
        sys.exit(result.returncode)
    return result.returncode


def main() -> None:
    print()
    print("═" * 45)
    print("  AI Agents Starter Kit – Python Setup")
    print("═" * 45)
    print()

    # Verify Python version
    major, minor = sys.version_info.major, sys.version_info.minor
    if major < 3 or (major == 3 and minor < 10):
        print(f"✗ Python >= 3.10 required. Current version: {major}.{minor}")
        sys.exit(1)
    print(f"✔ Python {major}.{minor} detected.")

    # Installing development dependencies...
    print()
    print("Installing development dependencies...")
    run([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
    run([sys.executable, "-m", "pip", "install", "pytest>=8.0", "flake8>=7.0", "black>=24.0"])
    print("✔ Dependencies installed!")

    # Verify requirements.txt (optional)
    if os.path.exists("requirements.txt"):
        print()
        print("Installing requirements.txt...")
        run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✔ requirements.txt installed!")
    else:
        print("ℹ  requirements.txt not found – skipping.")

    print()
    print("═" * 45)
    print("✔ Python environment ready!")
    print("  Run tests with: pytest -q")
    print("═" * 45)
    print()


if __name__ == "__main__":
    main()
