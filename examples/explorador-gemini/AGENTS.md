# Agente Explorador (Gemini CLI)

Este agente utiliza a **janela de contexto de 2M de tokens** do Gemini para analisar repositórios inteiros ou documentações extensas em um único prompt.

## Configuração

1. Certifique-se que o `gemini-cli` está instalado: `npm install -g @google/gemini-cli`
2. Configure sua chave: `export GEMINI_API_KEY=your_key`
3. O modelo padrão é o `gemini-2.0-flash-exp` (ou superior).

## Uso

Para explorar este repositório:

```bash
gemini --system "Você é um arquiteto de software especialista em IA." \
  --context "README.md, AGENTS.md, scripts/init-ai.mjs" \
  "Descreva a arquitetura deste projeto e sugira 3 melhorias estruturais."
```

## Vantagens do Gemini para este caso
- **Janela Gigante**: Pode ler o projeto inteiro sem precisar de RAG complexo.
- **Multimodal**: Pode ler diagramas em imagens (via `--image`).
- **Velocidade**: O Flash 2.0 é ideal para análise de código rápida.

---

## Skills e Memória

Este agente consulta `../../AGENTS.md` e usa as regras de memória do `projects.json` local se disponível.

```