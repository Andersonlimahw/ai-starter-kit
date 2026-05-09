---
name: jest-pro
description: Jest Expert. Mock configuration, coverage, and asynchronous testing.
---

# Jest Pro Skill

Use to create or improve unit tests with Jest.

## Rules
- Always use `jest.spyOn` for mocks if possible.
- Minimum 80% coverage for critical logic.
- Use `test.each` for decision tables.

## Example
```javascript
test('should do X', () => {
  const spy = jest.spyOn(console, 'log');
  // ...
});
```
