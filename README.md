# MyERP 🚀

**Sistema de gestão empresarial moderno, automatizado e escalável**

MyERP é uma plataforma SaaS de gestão empresarial completa, desenvolvida com tecnologias modernas e preparada para escalar globalmente. Centraliza a gestão de produtos, estoque, vendas, clientes, fornecedores, faturas, financeiro e muito mais.

## 📋 Características Principais

- ✅ Dashboard com métricas em tempo real
- ✅ Gestão de Produtos e Estoque automatizada
- ✅ Controle de Vendas e Faturas
- ✅ Gestão de Clientes e Fornecedores
- ✅ Módulo Financeiro completo
- ✅ Sistema de Permissões por Função
- ✅ Multi-tenant (isolamento de dados por empresa)
- ✅ Autenticação JWT segura
- ✅ Interface responsiva (Desktop, Tablet, Mobile)
- ✅ Tema claro/escuro
- ✅ Relatórios e exportações (PDF, CSV, Excel)
- ✅ Auditoria e logs de atividades

## 🏗️ Arquitetura

```
MyERP/
├── backend/          # API REST (Node.js + Express + TypeScript)
├── web/              # Frontend Web (Next.js + React + TypeScript)
├── database/         # Schema e migrations (Prisma)
├── docs/             # Documentação técnica
├── docker-compose.yml
└── README.md
```

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js** 14+ (Framework React)
- **React** 18+ (UI Library)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Styling)
- **Zod** (Validação)

### Backend
- **Node.js** 20+ (Runtime)
- **Express.js** 4+ (Web framework)
- **TypeScript** (Type safety)
- **Prisma** (ORM)
- **PostgreSQL** 14+ (Database)
- **JWT** (Autenticação)
- **bcryptjs** (Hashing de senhas)

### Testing & Tools
- **Vitest** (Unit tests)
- **Playwright** (E2E tests)
- **OpenAPI/Swagger** (API docs)

## 📦 Requisitos

- **Node.js**: 20.x ou superior
- **npm**: 10.x ou superior
- **PostgreSQL**: 14.x ou superior
- **Docker** (opcional, recomendado)

## 🚀 Instalação e Setup

### 1. Clonar o repositório

```bash
git clone https://github.com/adjay-dev/MyERP.git
cd MyERP
```

### 2. Instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../web
npm install
```

### 3. Configurar variáveis de ambiente

```bash
# Backend
cd backend
cp .env.example .env

# Frontend
cd ../web
cp .env.local.example .env.local
```

### 4. Configurar banco de dados

```bash
# Criar banco de dados
createdb myerp_dev

# Executar migrations
cd backend
npx prisma migrate dev --name init

# Seed (dados de desenvolvimento)
npx prisma db seed
```

### 5. Executar aplicação

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd web
npm run dev
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger API Docs**: http://localhost:3001/api/docs

## 🔐 Variáveis de Ambiente

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myerp_dev

# JWT
JWT_SECRET=sua_chave_super_secreta_aqui_muito_longa
JWT_EXPIRATION=24h

# API
API_PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📚 Documentação

- [API Documentation](./docs/API.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Setup Guide](./docs/SETUP.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 🗂️ Estrutura do Projeto

### Backend

```
backend/
├── src/
│   ├── config/          # Configurações (BD, JWT, etc)
│   ├── middleware/      # Middlewares (auth, errors, cors)
│   ├── routes/          # Definição de rotas
│   ├── controllers/     # Lógica de requisições
│   ├── services/        # Regras de negócio
│   ├── models/          # Schema Prisma
│   ├── utils/           # Funções utilitárias
│   ├── types/           # TypeScript types
│   └── app.ts           # Instância Express
├── tests/               # Testes
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   └── seed.ts          # Seed data
├── .env.example
├── package.json
└── tsconfig.json
```

### Frontend

```
web/
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── (auth)/      # Páginas de auth
│   │   ├── (dashboard)/ # Páginas do dashboard
│   │   └── layout.tsx
│   ├── components/      # Componentes reutilizáveis
│   │   ├── common/
│   │   ├── layout/
│   │   └── modules/
│   ├── hooks/           # Custom hooks
│   ├── services/        # Chamadas API
│   ├── contexts/        # Context API
│   ├── utils/           # Helpers
│   ├── types/           # TypeScript types
│   └── styles/          # Tailwind config
├── public/              # Arquivos estáticos
├── tests/               # Testes
├── .env.local.example
├── package.json
└── tsconfig.json
```

## 🔄 Fluxo de Desenvolvimento

### Fase 1: Fundação (ATUAL)
- ✅ Configuração do projeto
- ✅ Frontend e Backend estruturados
- ✅ Autenticação completa
- ✅ Dashboard básico
- ✅ Multi-tenant setup

### Fase 2: Módulos Básicos
- Empresas e Utilizadores
- Permissões por Função
- Dashboard avançado

### Fase 3: Produtos e Estoque
- Gestão de Produtos
- Categorias
- Controle automático de Estoque

### Fase 4: Clientes e Fornecedores
- Cadastro de Clientes
- Cadastro de Fornecedores
- Histórico de transações

### Fase 5: Vendas e Faturas
- Sistema de Vendas
- Carrinho de compras
- Gestão de Faturas
- Geração de PDF

### Fase 6: Compras e Financeiro
- Módulo de Compras
- Gestão de Despesas
- Análises Financeiras

### Fase 7: Relatórios e Automação
- Relatórios completos
- Exportações (PDF, CSV, Excel)
- Sistema de Notificações
- Automações

### Fase 8: Polimento
- Testes completos
- Segurança aprofundada
- Performance
- Preparação para produção

## 🧪 Testes

```bash
# Backend: Unit tests
cd backend
npm run test

# Frontend: Unit tests
cd ../web
npm run test

# E2E tests
npm run test:e2e
```

## 🐳 Docker

```bash
# Iniciar com Docker Compose
docker-compose up -d

# Parar
docker-compose down
```

## 📝 Convenções de Código

- **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc)
- **Branches**: `feature/nome-da-feature`, `bugfix/nome-do-bug`
- **Code Style**: ESLint + Prettier configurados
- **Naming**: camelCase para variáveis, PascalCase para componentes/classes

## 🔐 Segurança

- Validação de entrada com Zod
- Hash seguro de senhas com bcryptjs
- JWT para autenticação
- CORS configurado
- Rate limiting em endpoints críticos
- Proteção contra acesso entre empresas
- Variáveis de ambiente para segredos
- Logs de auditoria

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença GPL-3.0. Veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

**Adjay Dev** - [@adjay-dev](https://github.com/adjay-dev)

## 📞 Suporte

Para dúvidas, issues ou sugestões, abra uma [issue no GitHub](https://github.com/adjay-dev/MyERP/issues).

---

**MyERP** - Transformando a gestão empresarial em simplicidade 🚀
