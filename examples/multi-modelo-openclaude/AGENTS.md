# Agente Multi-Modelo (OpenClaude)

O **OpenClaude** permite trocar o modelo de backend (Anthropic, OpenAI, Google, Ollama) sem mudar o seu workflow de CLI.

## Configuração

1. Instale o OpenClaude: `npm install -g @gitlawb/openclaude`
2. Configure seus provedores:
```bash
openclaude /provider anthropic API_KEY
openclaude /provider openai API_KEY
openclaude /provider google API_KEY
```

## Uso

Para rodar uma tarefa pesada (Opus):
```bash
openclaude --model "claude-3-opus-20240229" "Refatore este componente de UI complexo."
```

Para rodar algo rápido e barato (Haiku/Flash):
```bash
openclaude --model "claude-3-5-haiku-20241022" "Gere 5 casos de teste para esta função."
```

## Vantagens
- **Independência de Vendor**: Se a Anthropic cair, mude para OpenAI ou Google.
- **Modelos Locais**: Use o Ollama para privacidade total em código sensível.
- **Custo**: Use modelos menores para tarefas triviais.

---

## Skills e Memória

Este agente consulta `../../AGENTS.md`. Use `/memory` no OpenClaude para gerenciar o contexto persistente.
