# Multi-Model Agent (OpenCode)

**OpenCode** allows you to switch the backend model (Anthropic, OpenAI, Google, Ollama) without changing your CLI workflow.

## Configuration

1. Install OpenCode: `npm install -g opencode-ai`
2. Configure your providers:
```bash
opencode /provider anthropic API_KEY
opencode /provider openai API_KEY
opencode /provider google API_KEY
```

## Usage

To run a heavy task (Opus):
```bash
opencode --model "claude-3-opus-20240229" "Refactor this complex UI component."
```

To run something fast and cheap (Haiku/Flash):
```bash
opencode --model "claude-3-5-haiku-20241022" "Generate 5 test cases for this function."
```

## Advantages
- **Vendor Independence**: If Anthropic goes down, switch to OpenAI or Google.
- **Local Models**: Use Ollama for full privacy on sensitive code.
- **Cost**: Use smaller models for trivial tasks.

---

## Skills and Memory

This agent consults `../../AGENTS.md`. Use `/memory` in OpenCode to manage persistent context.
