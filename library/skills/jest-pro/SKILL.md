---
name: jest-pro
description: Expert em Jest. Configuração de mocks, coverage e testes assíncronos.
---

# Jest Pro Skill

Use para criar ou melhorar testes unitários com Jest.

## Regras
- Sempre use `jest.spyOn` para mocks se possível.
- Cobertura mínima de 80% em lógica crítica.
- Use `test.each` para tabelas de decisão.

## Exemplo
```javascript
test('should do X', () => {
  const spy = jest.spyOn(console, 'log');
  // ...
});
```
