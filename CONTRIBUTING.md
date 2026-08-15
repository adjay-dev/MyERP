# Contribuindo para MyERP

## 🙏 Obrigado por contribuir!

Este documento orienta como contribuir para o projeto MyERP.

---

## 🐛 Reportando Bugs

1. Verifique se o bug já foi reportado em [Issues](https://github.com/adjay-dev/MyERP/issues)
2. Se não, [crie uma nova issue](https://github.com/adjay-dev/MyERP/issues/new)
3. Inclua:
   - Descrição clara do bug
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Screenshots (se aplicável)
   - Seu ambiente (OS, Node version, etc)

---

## 💡 Sugerindo Features

1. Use a label `enhancement` para feature requests
2. Descreva o caso de uso
3. Explique o benefício
4. Relate com o roadmap do projeto

---

## 🔀 Workflow de Pull Request

### 1. Fork e Clone

```bash
git clone https://github.com/adjay-dev/MyERP.git
cd MyERP
```

### 2. Criar Branch

```bash
# Feature
git checkout -b feature/descrição-curta

# Bug fix
git checkout -b bugfix/descrição-curta

# Documentation
git checkout -b docs/descrição-curta
```

### 3. Fazer Alterações

- Siga as [convenções de código](./docs/DEVELOPMENT.md#convenções-de-código)
- Use TypeScript
- Adicione tipos
- Valide com Zod

### 4. Testes

```bash
# Backend
cd backend
npm run test

# Frontend
cd web
npm run test
```

### 5. Commit

```bash
# Use conventional commits
git commit -m "feat: descrição da mudança"
git commit -m "fix: correção do bug"
git commit -m "docs: atualização da documentação"
```

### 6. Push e PR

```bash
git push origin feature/sua-feature
```

Depois, abra um Pull Request no GitHub com:
- Título claro
- Descrição do que foi mudado
- Referência a issues relacionadas
- Screenshots (se aplicável)

---

## ✅ Checklist de PR

- [ ] Código segue as convenções do projeto
- [ ] TypeScript sem erros (`npm run lint`)
- [ ] Testes passam (`npm run test`)
- [ ] Nenhum `console.log` de debug
- [ ] Documentação atualizada
- [ ] Commit messages seguem convenção
- [ ] Sem arquivos desnecessários (`.DS_Store`, `node_modules`, etc)

---

## 🎓 Conventions

### Branch Names

```
feature/nova-funcionalidade
fixbug/nome-do-bug
docs/atualizar-readme
refactor/melhorar-performance
chore/atualizar-dependencias
```

### Commit Messages

```
feat: adicionar novo recurso
fix: corrigir bug específico
docs: atualizar documentação
style: formatação de código
refactor: refatorar função
test: adicionar testes
chore: atualização de deps
```

### Code Style

- TypeScript strict mode
- ESLint + Prettier configurados
- 2 espaços de indentação
- Sem trailing commas em single lines
- Nomes descritivos

---

## 📋 Roadmap

Veja [ARCHITECTURE.md](./docs/ARCHITECTURE.md#roadmap-de-desenvolvimento) para o roadmap completo.

---

## ❓ Dúvidas?

- Abra uma [Discussion](https://github.com/adjay-dev/MyERP/discussions)
- Consulte a [documentação](./docs/)
- Veja [DEVELOPMENT.md](./docs/DEVELOPMENT.md)

---

**Obrigado por fazer MyERP melhor!** 🚀
