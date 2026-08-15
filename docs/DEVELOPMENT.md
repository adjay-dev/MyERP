# DEVELOPMENT.md - Guia de Desenvolvimento

## 🎯 Princípios de Desenvolvimento

1. **Type Safety**: Sempre use TypeScript
2. **Validação**: Use Zod para validar inputs
3. **Segurança**: Nunca exponha dados sensíveis
4. **Performance**: Otimize queries e componentes
5. **Testes**: Teste funcionalidades críticas
6. **Clean Code**: Código legível e bem organizado
7. **Documentation**: Documente código complexo

---

## 📝 Convenções de Código

### Commits

Use conventional commits:

```bash
feat: adicionar novo recurso
fix: corrigir bug
docs: atualizar documentação
style: formatação
refactor: refatorar código
test: adicionar testes
chore: atualizações de dependências
```

Exemplos:
```bash
git commit -m "feat: adicionar CRUD de produtos"
git commit -m "fix: corrigir validação de email"
git commit -m "docs: atualizar README"
```

### Branches

```bash
feature/nome-da-feature    # Nova funcionalidade
bugfix/nome-do-bug         # Correção de bug
docs/nome-da-doc           # Documentação
refactor/nome-refactor     # Refatoração
```

Exemplos:
```bash
git checkout -b feature/adicionar-produtos
git checkout -b bugfix/corrigir-autenticacao
git checkout -b docs/atualizar-setup
```

### Naming Conventions

#### Backend (TypeScript/Node)

```typescript
// Constantes: SNAKE_CASE
const JWT_SECRET = process.env.JWT_SECRET;
const MAX_ITEMS = 100;

// Variáveis: camelCase
const userData = { id: '123', email: 'user@email.com' };
let currentUser = null;

// Funções: camelCase
function getUserById(id: string) { }
const createProduct = async (data: ProductInput) => { }

// Classes: PascalCase
class UserService { }
class AppError extends Error { }

// Tipos: PascalCase
interface User { }
type ProductInput = { }
enum Role { ADMIN, USER }
```

#### Frontend (React/TypeScript)

```typescript
// Componentes: PascalCase
function UserCard() { }
const ProductList = () => { }

// Hooks: camelCase com prefixo 'use'
function useAuth() { }
const useProducts = () => { }

// Props interface: ComponentNameProps
interface UserCardProps {
  userId: string;
}

// Event handlers: handleXxx
const handleClick = () => { }
const handleSubmit = (e: React.FormEvent) => { }

// Booleans com prefixo 'is' ou 'has'
const isLoading = false;
const hasError = true;
```

---

## 🏗️ Estrutura de Pastas

### Adicionar Nova Feature no Backend

1. **Criar rota** (`src/routes/feature.ts`):
```typescript
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, (req, res) => {
  // Handler
});

export default router;
```

2. **Registrar no index** (`src/routes/index.ts`):
```typescript
import featureRoutes from './feature';

router.use('/features', featureRoutes);
```

3. **Adicionar ao Prisma** (`prisma/schema.prisma`):
```prisma
model Feature {
  id        String   @id @default(cuid())
  name      String
  company   Company  @relation(fields: [companyId], references: [id])
  companyId String
  createdAt DateTime @default(now())
}
```

4. **Executar migration**:
```bash
npx prisma migrate dev --name add_feature
```

### Adicionar Nova Página no Frontend

1. **Criar página** (`src/app/(dashboard)/features/page.tsx`):
```typescript
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';

export default function FeaturesPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Features</h1>
      <Card>{/* Content */}</Card>
    </div>
  );
}
```

2. **Adicionar ao Sidebar** (`src/components/Sidebar.tsx`):
```typescript
const menuItems = [
  // ...
  { href: '/features', icon: Feature, label: 'Features' },
];
```

---

## 🔐 Segurança

### Validação de Input

```typescript
// Sempre validar com Zod
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

type User = z.infer<typeof userSchema>;

// No handler
const result = userSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ error: result.error });
}
```

### Proteção de Dados Sensíveis

```typescript
// ❌ NUNCA faça isto
logger.info('User password:', user.password);
return { ...user, password: user.password };

// ✅ SEMPRE faça isto
logger.info('User login successful');
return {
  id: user.id,
  email: user.email,
  name: user.name,
  // password NOT included
};
```

### Verificação de Multi-Tenancy

```typescript
// ✅ Sempre verificar companyId
const product = await prisma.product.findUnique({
  where: { id: productId }
});

if (product.companyId !== req.user.companyId) {
  throw new AppError(403, 'Access denied');
}
```

---

## 🧪 Testes

### Unit Test Exemplo (Backend)

```typescript
// backend/src/tests/password.test.ts
import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../utils/password';

describe('Password Utils', () => {
  it('should hash a password', async () => {
    const password = 'SecurePass123';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should verify correct password', async () => {
    const password = 'SecurePass123';
    const hash = await hashPassword(password);
    const isValid = await comparePassword(password, hash);

    expect(isValid).toBe(true);
  });
});
```

### Unit Test Exemplo (Frontend)

```typescript
// web/src/tests/unit/components/Card.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@/components/ui/Card';

describe('Card Component', () => {
  it('should render children', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Card className="custom-class">Test</Card>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

### E2E Test Exemplo

```typescript
// web/tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  // Navigate to login
  await page.goto('/auth/login');

  // Fill form
  await page.fill('input[type="email"]', 'admin@demo.com');
  await page.fill('input[type="password"]', 'Admin@123');

  // Submit
  await page.click('button[type="submit"]');

  // Should redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

### Executar Testes

```bash
# Backend
cd backend
npm run test                # Todos os testes
npm run test -- auth        # Apenas testes de auth
npm run test:coverage       # Com coverage

# Frontend
cd web
npm run test
npm run test:e2e
```

---

## 🐛 Debugging

### Backend

```bash
# Com debug logs
DEBUG=myerp:* npm run dev

# Chrome DevTools
node --inspect=0.0.0.0:9229 dist/index.js
```

### Frontend

```bash
# Com React DevTools
npm run dev

# Adicionar console.log
console.log('Debug:', variable);

# Usar debugger
debugging;
```

### Database

```bash
# Abrir Prisma Studio
npm run db:studio

# Query diretamente
psql postgresql://myerp_dev:password@localhost/myerp_dev
```

---

## 📊 Performance

### Frontend

```typescript
// ✅ Boa: Lazy loading
const ProductList = dynamic(() => import('./ProductList'), {
  loading: () => <div>Loading...</div>,
});

// ✅ Boa: Memoization para evitar re-renders
import { memo } from 'react';

const UserCard = memo(({ user }) => {
  return <div>{user.name}</div>;
});

// ✅ Boa: useCallback para estabilizar funções
const handleClick = useCallback(() => {
  // action
}, []);
```

### Backend

```typescript
// ✅ Boa: Query otimizada com select
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    name: true,
    // password NOT selected
  },
});

// ✅ Boa: Eager loading para evitar N+1
const products = await prisma.product.findMany({
  include: {
    category: true, // Carrega categoria junto
  },
});

// ✅ Boa: Usar transações para operações críticas
const result = await prisma.$transaction(async (tx) => {
  const sale = await tx.sale.create({ data: {} });
  await tx.product.update({
    where: { id: productId },
    data: { currentStock: { decrement: quantity } },
  });
  return sale;
});
```

---

## 🚀 Deploy Checklist

### Antes de Deploy

- [ ] Testes passando
- [ ] Sem console.log em produção
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrações atualizadas
- [ ] HTTPS habilitado
- [ ] JWT_SECRET forte
- [ ] CORS configurado para domínio correto
- [ ] Rate limiting ativado
- [ ] Logs estruturados
- [ ] Backup de banco antes de deploy

### Variáveis de Ambiente Produção

```env
# Backend
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=very_long_secure_key_min_32_chars
CORS_ORIGIN=https://seu-dominio.com
API_PORT=3001

# Frontend
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com/api
```

---

## 📚 Recursos Úteis

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev/)

---

**Última atualização**: Agosto 2026
