# ARCHITECTURE.md - Arquitetura do Sistema

## 📐 Visão Geral

MyERP é um sistema ERP moderno com arquitetura em camadas seguindo princípios de clean code e domain-driven design.

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Web)                          │
│  Next.js + React + TypeScript + Tailwind CSS               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Pages (Auth, Dashboard, Modules)                     │  │
│  │ Components (Sidebar, Header, UI)                     │  │
│  │ Contexts (Auth, Theme)                               │  │
│  │ Services (API Client)                                │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       │ JWT Tokens
┌──────────────────────▼──────────────────────────────────────┐
│                  API GATEWAY (Backend)                      │
│  Express.js + TypeScript + Node.js                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Routes (/api/...)                                    │  │
│  │ Middleware (Auth, CORS, Error Handling)              │  │
│  │ Controllers (Request Handling)                        │  │
│  │ Services (Business Logic)                            │  │
│  │ Utils (Validation, JWT, Password)                    │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL/Prisma
                       │ Transactions
┌──────────────────────▼──────────────────────────────────────┐
│                   PERSISTENCE LAYER                         │
│  Prisma ORM + PostgreSQL                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Users (id, email, password, role, companyId)         │  │
│  │ Companies (Multi-tenant isolation)                   │  │
│  │ Products (SKU, pricing, stock)                       │  │
│  │ Sales & Purchases (Transactions)                     │  │
│  │ Customers & Suppliers (Relations)                    │  │
│  │ Expenses & Financial (Reports)                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Stack Tecnológico

### Frontend

```
Next.js 14
  ├── React 18 (UI Components)
  ├── TypeScript 5 (Type Safety)
  ├── Tailwind CSS 3 (Styling)
  ├── Axios (HTTP Client)
  └── Zod (Validation)
```

**Características**:
- Server-side rendering (SSR) e Static generation
- API routes built-in
- Image optimization
- Font optimization
- Code splitting automático

### Backend

```
Node.js 20
  ├── Express.js 4 (Framework)
  ├── TypeScript 5 (Type Safety)
  ├── Prisma 5 (ORM)
  ├── PostgreSQL 14 (Database)
  ├── JWT (Authentication)
  ├── bcryptjs (Password Hashing)
  └── Zod (Validation)
```

**Características**:
- REST API
- Middleware pipeline
- Error handling centralizado
- Multi-tenant support
- Transações ACID

### Database

```
PostgreSQL 14
  ├── Prisma Schema (Type-safe models)
  ├── Migrations (Version control)
  ├── Relationships (Foreign keys)
  ├── Constraints (Data integrity)
  └── Indexes (Performance)
```

---

## 📁 Estrutura de Diretórios

### Frontend (`web/`)

```
web/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── products/page.tsx     # Fase 3
│   │   │   ├── customers/page.tsx    # Fase 4
│   │   │   ├── sales/page.tsx        # Fase 5
│   │   │   ├── invoices/page.tsx     # Fase 5
│   │   │   └── layout.tsx
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── common/                   # Shared components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── Header.tsx
│   │   ├── ui/
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx            # Fase 2
│   │   │   ├── Modal.tsx             # Fase 2
│   │   │   └── Table.tsx             # Fase 3
│   │   ├── modules/                  # Feature-specific
│   │   │   ├── auth/
│   │   │   ├── products/             # Fase 3
│   │   │   └── sales/                # Fase 5
│   │   └── Providers.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/                        # Custom hooks (Fase 2)
│   ├── services/
│   │   ├── api.ts                    # HTTP client
│   │   └── auth.ts                   # Auth service
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── cn.ts
├── tests/
│   ├── unit/                         # Unit tests (Fase 8)
│   └── e2e/                          # E2E tests (Fase 8)
├── public/                           # Static files
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Backend (`backend/`)

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts                    # Environment variables
│   │   └── database.ts               # Prisma client
│   ├── middleware/
│   │   ├── auth.ts                   # JWT middleware
│   │   ├── errorHandler.ts           # Error handling
│   │   └── cors.ts                   # CORS config
│   ├── routes/
│   │   ├── index.ts                  # Router principal
│   │   ├── auth.ts                   # Auth endpoints
│   │   ├── products.ts               # Fase 3
│   │   ├── customers.ts              # Fase 4
│   │   ├── sales.ts                  # Fase 5
│   │   └── invoices.ts               # Fase 5
│   ├── controllers/                  # Request handlers (Fase 2)
│   ├── services/                     # Business logic (Fase 2)
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   └── validation.ts
│   └── index.ts                      # App entry point
├── prisma/
│   ├── schema.prisma                 # Data model
│   └── seed.ts                       # Seed data
├── tests/
│   ├── unit/                         # Unit tests
│   └── integration/                  # Integration tests
├── .env.example
├── tsconfig.json
├── eslint.config.json
└── package.json
```

---

## 🔄 Fluxo de Dados

### Autenticação

```
┌──────────────────────────────────────────────────────────────┐
│ USUÁRIO FARÁ LOGIN                                           │
└─────────────────────────┬──────────────────────────────────┘
                          │
           ┌──────────────▼───────────────┐
           │ Frontend: /auth/login        │
           │ Email + Password             │
           └──────────────┬───────────────┘
                          │
           ┌──────────────▼───────────────┐
           │ POST /api/auth/login         │
           │ (email, password)            │
           └──────────────┬───────────────┘
                          │
           ┌──────────────▼───────────────┐
           │ Backend: Validate input      │
           │ Hash comparison              │
           └──────────────┬───────────────┘
                          │
           ┌──────────────▼───────────────┐
           │ Generate JWT Token           │
           │ Payload: {id, email, role}   │
           └──────────────┬───────────────┘
                          │
           ┌──────────────▼───────────────┐
           │ Return token + user data     │
           └──────────────┬───────────────┘
                          │
           ┌──────────────▼───────────────┐
           │ Frontend: Save token         │
           │ localStorage.setItem('token')│
           └──────────────┬───────────────┘
                          │
           ┌──────────────▼───────────────┐
           │ Update AuthContext          │
           │ Redirect to /dashboard       │
           └──────────────────────────────┘
```

### Requisição Autenticada

```
┌──────────────────────────────────────────────────────────────┐
│ USUÁRIO ACESSA RECURSO PROTEGIDO                            │
└─────────────────────────┬──────────────────────────────────┘
                          │
           ┌──────────────▼──────────────────┐
           │ Frontend: GET /api/products     │
           │ Header: Authorization: Bearer..│
           └──────────────┬──────────────────┘
                          │
           ┌──────────────▼──────────────────┐
           │ Backend: authMiddleware         │
           │ Verify JWT                      │
           └──────────────┬──────────────────┘
                          │
                  ┌───────┴───────┐
                  │               │
              ✅ Válido       ❌ Inválido
                  │               │
         ┌────────▼────────┐   │ Return 401
         │ Extract user ID │   │ Unauthorized
         │ companyId       │   │
         │ role            │   │
         └────────┬────────┘   │
                  │            │
         ┌────────▼────────┐   │
         │ Attach to req   │   │
         │ req.user = {...}│   │
         └────────┬────────┘   │
                  │            │
         ┌────────▼────────┐   │
         │ Check role      │   │
         │ requireRole()   │   │
         └────────┬────────┘   │
                  │            │
         ┌────────▼────────┐   │
         │ Execute handler │   │
         │ return data     │   │
         └────────┬────────┘   │
                  │            │
                  │◄───────────┘
                  │
         ┌────────▼────────┐
         │ Return response │
         │ Frontend updates│
         │ UI              │
         └────────────────┘
```

---

## 🔐 Multi-Tenancy

### Isolamento de Dados

Cada empresa (tenant) tem seus próprios dados isolados:

```
Company A (companyId: 'abc123')
├── Users (apenas da Company A)
├── Products (apenas da Company A)
├── Sales (apenas da Company A)
└── Customers (apenas da Company A)

Company B (companyId: 'xyz789')
├── Users (apenas da Company B)
├── Products (apenas da Company B)
├── Sales (apenas da Company B)
└── Customers (apenas da Company B)
```

### Como Funciona

1. **JWT contém companyId**:
   ```typescript
   const token = jwt.sign({
     id: user.id,
     email: user.email,
     companyId: user.companyId,  // ← Isolamento
     role: user.role
   });
   ```

2. **Queries filtradas por companyId**:
   ```typescript
   // Backend nunca retorna dados de outra empresa
   const products = await prisma.product.findMany({
     where: {
       companyId: req.user.companyId  // ← Filtro obrigatório
     }
   });
   ```

3. **Validação em cada operação**:
   ```typescript
   // Verificar se o recurso pertence à empresa do usuário
   const product = await prisma.product.findUnique({
     where: { id: productId }
   });
   
   if (product.companyId !== req.user.companyId) {
     throw new AppError(403, 'Access denied');
   }
   ```

---

## 🚀 Performance

### Frontend

- **Code Splitting**: Rotas carregadas sob demanda
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Google Fonts otimizadas
- **Caching**: Service workers e cache estratégias

### Backend

- **Database Indexes**: SKU, email, companyId indexados
- **Query Optimization**: Eager loading com Prisma
- **Connection Pooling**: Reutilização de conexões
- **Rate Limiting**: Proteção contra abuso (Fase 8)

---

## 🔒 Segurança

### Frontend

- ✅ Senhas nunca armazenadas
- ✅ Tokens em localStorage (alternativa: cookies httpOnly)
- ✅ HTTPS em produção
- ✅ CSP headers
- ✅ XSS prevention

### Backend

- ✅ Senha com bcryptjs (salt rounds: 10)
- ✅ JWT com expiração
- ✅ CORS configurado
- ✅ Input validation com Zod
- ✅ SQL injection prevention (Prisma)
- ✅ Rate limiting (Fase 8)
- ✅ HTTPS em produção

---

## 🧪 Testes

### Estrutura

```
backend/tests/
├── unit/                    # Testes unitários
│   ├── auth.test.ts
│   ├── products.test.ts     # Fase 3
│   └── sales.test.ts        # Fase 5
└── integration/             # Testes de integração
    ├── auth.integration.ts
    └── api.integration.ts

web/tests/
├── unit/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── e2e/
    ├── auth.spec.ts
    ├── dashboard.spec.ts
    └── products.spec.ts     # Fase 3
```

### Executar Testes

```bash
# Backend
cd backend
npm run test

# Frontend
cd web
npm run test
npm run test:e2e
```

---

## 📈 Roadmap de Desenvolvimento

### ✅ Fase 1: Fundação (ATUAL)
- [x] Setup inicial
- [x] Autenticação
- [x] Multi-tenant
- [x] Dashboard básico

### ⏳ Fase 2: Componentes & Permissões
- [ ] UI Components (Button, Modal, Table)
- [ ] Sistema de permissões avançado
- [ ] Custom hooks
- [ ] Error boundaries

### ⏳ Fase 3: Produtos & Estoque
- [ ] CRUD de produtos
- [ ] Categorias
- [ ] Gestão de estoque
- [ ] Alertas de estoque baixo

### ⏳ Fase 4: Clientes & Fornecedores
- [ ] CRUD de clientes
- [ ] CRUD de fornecedores
- [ ] Histórico de compras
- [ ] Relacionamentos

### ⏳ Fase 5: Vendas & Faturas
- [ ] Sistema de vendas
- [ ] Carrinho de compras
- [ ] Gestão de faturas
- [ ] PDF generation

### ⏳ Fase 6-8: Completar funcionalidades
- [ ] Compras, despesas, financeiro
- [ ] Relatórios e exportações
- [ ] Notificações
- [ ] Testes completos
- [ ] Deploy

---

## 📞 Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
