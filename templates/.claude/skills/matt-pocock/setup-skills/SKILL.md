---
name: setup-matt-pocock-skills
description: >
  Initialization phase. Scaffolds the per-repo config for engineering skills.
  Trigger: "/setup-matt-pocock-skills", "setup engineering skills".
---

# Setup Engineering Skills

Configures the workspace to support advanced engineering workflows.

## What it does

1. **Issue Tracker Config**: Sets up the mapping for GitHub, Linear, or local issues.
2. **Docs Layout**: Defines where PRDs, ADRs, and specs live.
3. **Triage Labels**: Configures the vocabulary for issue status.

## Steps

- Run this once when starting a new project.
- The agent will ask for your preferred issue tracker and documentation structure.
- It will create a `CONVENTIONS.md` or update `AGENTS.md` with these settings.
