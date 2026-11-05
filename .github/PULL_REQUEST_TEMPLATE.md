## FitSync Pull Request & Pre-Merge Checklist

### Description
<!-- Brief summary of feature, bug fix, or refactoring -->

### Verification Checklist (FitSync Project Plan Standard)
- [ ] **Unit Tests**: All pure-logic tests pass (`npm test tests/unit.test.js --workspace=server`).
- [ ] **Integration Tests**: Supertest integration suite passes against test database (`npm test tests/integration.test.js --workspace=server`).
- [ ] **Client Production Build**: Vite + PWA build compiles cleanly without errors (`npm run build --workspace=client`).
- [ ] **Zero Multikey Parallel Indexing**: No parallel multikey array indexes introduced in Mongoose schemas.
- [ ] **Dietary Rules Integrity**: Confirmed that dietary filters (Halal, Kosher, Vegetarian, Vegan, Jain, etc.) strictly exclude forbidden tags.
- [ ] **Calorie Target Floors**: Men $\ge 1,500$ kcal, Women $\ge 1,200$ kcal, Surplus burn task capped at 45 minutes.
- [ ] **OWASP & Secret Protection**: No API keys, passwords, or Atlas credentials committed in tracked files.
