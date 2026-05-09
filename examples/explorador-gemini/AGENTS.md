# Explorer Agent (Gemini CLI)

This agent uses Gemini's **2M token context window** to analyze entire repositories or extensive documentation in a single prompt.

## Setup

1. Ensure `gemini-cli` is installed: `npm install -g @google/gemini-cli`
2. Configure your key: `export GEMINI_API_KEY=your_key`
3. The default model is `gemini-2.0-flash-exp` (or higher).

## Usage

To explore this repository:

```bash
gemini --system "You are a software architect specializing in AI." \
  --context "README.md, AGENTS.md, scripts/init-ai.mjs" \
  "Describe the architecture of this project and suggest 3 structural improvements."
```

## Gemini Advantages for this case
- **Giant Window**: Can read the entire project without needing complex RAG.
- **Multimodal**: Can read diagrams in images (via `--image`).
- **Speed**: Flash 2.0 is ideal for fast code analysis.

---

## Skills and Memory

This agent consults `../../AGENTS.md` and uses local `projects.json` memory rules if available.

```