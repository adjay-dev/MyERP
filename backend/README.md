# MyERP Backend 🚀

API REST para o sistema MyERP, desenvolvido com Node.js, Express, TypeScript e PostgreSQL.

## 🛠️ Tecnologias

- **Node.js** 20+
- **Express.js** 4+
- **TypeScript** 5+
- **PostgreSQL** 14+
- **Prisma** ORM
- **JWT** para autenticação
- **Zod** para validação
- **Vitest** para testes

## 📋 Requisitos

- Node.js 20.x ou superior
- npm 10.x ou superior
- PostgreSQL 14.x ou superior

## 🚀 Instalação

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL=postgresql://myerp_dev:myerp_dev_password@localhost:5432/myerp_dev
JWT_SECRET=sua_chave_super_secreta_aqui_change_in_production
JWT_EXPIRATION=24h
API_PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Criar banco de dados

```bash
# Com psql instalado
createdb myerp_dev
```

### 4. Executar migrations

```bash
npm run db:migrate
```

### 5. Seed (dados de teste)

```bash
npm run db:seed
```

## 🏃 Executar

### Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

### Produção

```bash
npm run build
npm start
```

## 📝 Comandos disponíveis

```bash
# Desenvolvimento
npm run dev          # Executar com hot-reload

# Build
npm run build        # Compilar TypeScript
npm start            # Executar versão compilada

# Testes
npm run test         # Executar testes
npm run test:ui      # Executar testes com UI
npm run test:coverage # Cobertura de testes

# Banco de dados
npm run db:migrate   # Executar migrations
npm run db:seed      # Popular banco com dados de teste
npm run db:studio    # Abrir Prisma Studio
npm run db:push      # Push schema para banco
npm run db:reset     # Resetar banco (CUIDADO!)

# Linting
npm run lint         # Verificar lint
npm run format       # Formatar código
```

## 📚 Rotas da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Obter usuário atual

## 🔐 Autenticação

As rotas protegidas requerem um token JWT no header `Authorization`:

```bash
Authorization: Bearer seu_token_aqui
```

## 🗂️ Estrutura de Pastas

```
src/
├── config/          # Configurações (BD, env, etc)
├── middleware/      # Middlewares (auth, errors, cors)
├── routes/          # Definição de rotas
├── controllers/     # Lógica de requisições
├── services/        # Regras de negócio
├── types/           # TypeScript types
├── utils/           # Funções utilitárias
└── index.ts         # Entrada da aplicação

prisma/
├── schema.prisma    # Schema do banco
└── seed.ts          # Seed data

tests/
└── *.test.ts        # Testes
```

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Com coverage
npm run test:coverage

# Interface gráfica
npm run test:ui
```

## 📖 Documentação do Banco

O schema Prisma define as seguintes entidades:

- **User**: Utilizadores do sistema
- **Company**: Empresas (tenants)
- **Product**: Produtos
- **Category**: Categorias de produtos
- **Customer**: Clientes
- **Supplier**: Fornecedores
- **Sale**: Vendas
- **SaleItem**: Itens de venda
- **Purchase**: Compras
- **PurchaseItem**: Itens de compra
- **Expense**: Despesas

## 🚨 Tratamento de Erros

Todos os endpoints retornam uma resposta padronizada:

**Sucesso (200)**
```json
{
  "success": true,
  "data": { /* dados */ }
}
```

**Erro (4xx, 5xx)**
```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

## 🔒 Segurança

- Senhas são hashadas com bcryptjs
- JWT para autenticação
- CORS configurado
- Validação com Zod
- Proteção contra acesso entre empresas (multi-tenant)

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.
