# Debugger Agent – Claude Code

This example demonstrates a **code debugging agent** using Claude Code.

## What it does

- Analyzes code for bugs and errors
- Uses the `SearchLogs` skill to check execution logs
- Creates sub-agents for parallel analysis when necessary
- Suggests fixes with clear explanations

## How to use

```bash
# In the kit root:
cd examples/depurador-claude
claude
```

Claude Code will read the `CLAUDE.md` in this folder and act as a specialized debugging agent.

## Structure

```
depurador-claude/
├── AGENTS.md       # This file (agent documentation)
├── CLAUDE.md       # Instructions for Claude Code
├── sample_bug.py   # Sample code with bugs to debug
└── memory_log.json # Agent memory log (generated during use)
```

## Usage example

```
You: Analyze the sample_bug.py file and find all bugs.

Claude: I'll analyze the file...
[reads sample_bug.py]
I found 3 issues:
1. Line 12: possible division by zero when `count = 0`
2. Line 28: `result` variable used before being initialized
3. Line 45: infinite loop if `items` is empty
...
```
