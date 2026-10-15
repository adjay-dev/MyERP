# MyERP — Pacote Completo de Entrega (Fase 1 → Fase 3)

Este arquivo reúne tudo que foi feito desde a Fase 1 até a conclusão da Fase 3 (Produtos & Estoque), incluindo instruções passo-a-passo para reproduzir, testar e validar localmente (backend + frontend), além de links diretos para os ficheiros importantes que foram adicionados/alterados.

IMPORTANTE: este ficheiro foi adicionado à branch `feat/phase-3-products-inventory`. Antes de aplicar migrações em produção, leia a seção "Riscos e migração".

---

## Sumário rápido
- Repositório: https://github.com/adjay-dev/MyERP
- Branch de entrega: feat/phase-3-products-inventory
- Objetivo: Projeto completo com backend (Express + Prisma), frontend (Next.js), autenticação JWT, multi-tenant, RBAC e Fase 3 implementada (Produtos & Estoque).

---

## 1) Clone e preparação

```bash
# Clonar repo
git clone https://github.com/adjay-dev/MyERP.git
cd MyERP

# Verificar branch feature (Fase 3)
git fetch origin
git checkout feat/phase-3-products-inventory
```

---

## 2) Arquivos-chave (links e descrição)

Backend (lista resumida dos ficheiros adicionados/modificados):
- backend/prisma/schema.prisma — schema Prisma com Product, Category(company-scoped), StockMovement, InventoryAlert. (VER NO REPO)
- backend/prisma/seed.ts — seed demo (company, admin, category, product)
- backend/src/index.ts — servidor Express (exporta app para testes)
- backend/src/config/database.ts — Prisma client
- backend/src/config/env.ts — variáveis de ambiente (DATABASE_URL, JWT_SECRET, ...)
- backend/src/middleware/auth.ts — authMiddleware e requireRole
- backend/src/middleware/errorHandler.ts — AppError e tratamento Zod
- backend/src/routes/index.ts — rotas principais (inclui products/categories/stock)
- backend/src/routes/auth.ts — auth routes (register/login/me)
- backend/src/routes/users.ts — users routes
- backend/src/routes/companies.ts — companies routes
- backend/src/routes/products.ts — CRUD produtos + adjust-stock
- backend/src/routes/categories.ts — CRUD categories
- backend/src/routes/stock.ts — stock summary + movements + alerts
- backend/src/utils/productValidation.ts — validações Zod para produtos/movimentos
- backend/prisma/seed.ts — seed
- backend/tests/integration/phase3.test.ts — testes de integração (Vitest + Supertest)

Frontend (lista resumida):
- web/src/app/(dashboard)/dashboard/page.tsx — dashboard base
- web/src/app/products/page.tsx — listagem (fetch) — implementada
- web/src/app/products/new/page.tsx — formulário criação produto

Documentação e helpers:
- docs/PHASE_3.md — documentação com passos de migração e smoke tests
- PHASES_SUMMARY.md — resumo consolidado (adicionado anteriormente)

---

## 3) Variáveis de ambiente necessárias
Crie `backend/.env` com pelo menos:

```
DATABASE_URL=postgresql://user:password@localhost:5432/myerp_dev
JWT_SECRET=sua_chave_super_secreta
JWT_EXPIRATION=24h
API_PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
APP_NAME=MyERP
APP_VERSION=1.0.0
```

E no frontend (web/.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 4) Instalar dependências e gerar Prisma client

```bash
# Backend
cd backend
npm install
npx prisma generate

# Frontend
cd ../web
npm install
```

---

## 5) Migrações e Seed (ordenado)

Escolha conforme seu ambiente:

Opção A — Ambiente de desenvolvimento (sem dados importantes):
```bash
cd backend
npx prisma migrate reset
npm run db:seed
```
Isto irá: resetar o banco, aplicar o schema atual e popular com dados seed (admin demo).

Opção B — Ambiente com dados (produção/staging):
- NÃO rode `prisma migrate reset`.
- Siga estratégia segura: adicionar `companyId` nullable → backfill → tornar obrigatório e aplicar índice unique. Se precisar, eu gero SQL específico.
- Em dev com dados parciais: `npx prisma migrate dev --name add-products-stock` (cuidado — leia risks).

---

## 6) Rodar servidores

```bash
# Backend
cd backend
npm run dev

# Frontend (em outra aba/terminal)
cd web
npm run dev
```

Back-end deve estar em http://localhost:3001 e frontend em http://localhost:3000 por padrão.

---

## 7) Smoke tests (script curl)
Salve o script abaixo como `scripts/smoke_phase3.sh` e torne executável (chmod +x):

```bash
#!/usr/bin/env bash
set -euo pipefail
API=http://localhost:3001/api
EMAIL="admin_test@example.com"
PASSWORD="Test1234!"
NAME="Admin Test"
COMPANY="MyERP Smoke Test Company"

echo "1) Health"
curl -s ${API}/health | jq .

echo "\n2) Register"
REG=$(curl -s -X POST ${API}/auth/register -H 'Content-Type: application/json' -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\",\"name\":\"${NAME}\",\"companyName\":\"${COMPANY}\"}")
echo "$REG" | jq .
TOKEN=$(echo "$REG" | jq -r '.data.token // empty')
if [ -z "$TOKEN" ]; then
  echo "Register failed; try login"
  exit 1
fi

echo "\n3) Create product"
CREATE=$(curl -s -X POST ${API}/products -H "Authorization: Bearer ${TOKEN}" -H 'Content-Type: application/json' -d '{"sku":"SMK-'"$(date +%s)"'","name":"Produto Smoke","costPrice":5.0,"salePrice":8.0}')
echo "$CREATE" | jq .
PROD_ID=$(echo "$CREATE" | jq -r '.data.id // empty')

echo "\n4) Purchase movement"
curl -s -X POST ${API}/stock/movements -H "Authorization: Bearer ${TOKEN}" -H 'Content-Type: application/json' -d "{\"productId\":\"${PROD_ID}\",\"type\":\"PURCHASE\",\"quantity\":10}" | jq .

echo "\n5) Sell attempt (too big)"
curl -s -X POST ${API}/stock/movements -H "Authorization: Bearer ${TOKEN}" -H 'Content-Type: application/json' -d "{\"productId\":\"${PROD_ID}\",\"type\":\"SALE\",\"quantity\":999999}" | jq .

echo "\n6) Alerts"
curl -s ${API}/stock/alerts -H "Authorization: Bearer ${TOKEN}" | jq .

echo "\nSmoke tests completed."
```

(Requer `jq` instalado para formatação)

---

## 8) Rodar testes automatizados (backend)
Os testes de integração estão em `backend/tests/integration/phase3.test.ts` (Vitest + Supertest).

Antes de rodar, exporte env vars:
```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/myerp_test
export JWT_SECRET=sua_chave_test
```

Em seguida:
```bash
cd backend
npm test
```

Se algum teste falhar, cole o log e eu analiso e corrijo os endpoints.

---

## 9) CI (opção recomendada)
Abaixo um exemplo de workflow GitHub Actions para rodar testes (coloque em `.github/workflows/ci.yml`):

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_DB: myerp_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U postgres -d myerp_test -h localhost" \
          --health-interval 10s --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install backend deps
        run: |
          cd backend
          npm ci
      - name: Generate Prisma client
        run: |
          cd backend
          npx prisma generate
      - name: Run migrations
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/myerp_test
        run: |
          cd backend
          npx prisma migrate deploy
      - name: Seed DB
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/myerp_test
        run: |
          cd backend
          npm run db:seed
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/myerp_test
          JWT_SECRET: 'testsecret'
        run: |
          cd backend
          npm test --silent
```

Observação: ajustes podem ser necessários para o tempo que o Postgres demora a ficar pronto.

---

## 10) Migração segura (produção)
Se você tem dados reais, NÃO execute `prisma migrate reset` em produção.
Plano resumido:
1. Criar migration que adiciona `companyId` na tabela `Category` como NULLABLE.
2. Executar backfill: atribuir `companyId` às categorias existentes (por exemplo, criar category por company ou atribuir a uma "company padrão").
3. Atualizar migration para tornar `companyId` NOT NULL e adicionar unique(name, companyId).
4. Testar backup/rollback antes.

Precisa de ajuda para gerar os SQLs? Posso preparar o script de backfill conforme o seu layout de dados.

---

## 11) Arquivos e conteúdos (links diretos)
Abra estes links no navegador para revisar o código no GitHub (branch: feat/phase-3-products-inventory):
- https://github.com/adjay-dev/MyERP/blob/feat/phase-3-products-inventory/backend/prisma/schema.prisma
- https://github.com/adjay-dev/MyERP/blob/feat/phase-3-products-inventory/backend/prisma/seed.ts
- https://github.com/adjay-dev/MyERP/blob/feat/phase-3-products-inventory/backend/src/routes/products.ts
- https://github.com/adjay-dev/MyERP/blob/feat/phase-3-products-inventory/backend/src/routes/categories.ts
- https://github.com/adjay-dev/MyERP/blob/feat/phase-3-products-inventory/backend/src/routes/stock.ts
- https://github.com/adjay-dev/MyERP/blob/feat/phase-3-products-inventory/backend/src/utils/productValidation.ts
- https://github.com/adjay-dev/MyERP/blob/feat/phase-3-products-inventory/backend/tests/integration/phase3.test.ts
- https://github.com/adjay-dev/MyERP/blob/feat/phase-3-products-inventory/web/src/app/products/page.tsx
- https://github.com/adjay-dev/MyERP/blob/feat/phase-3-products-inventory/web/src/app/products/new/page.tsx
- https://github.com/adjay-dev/MyERP/blob/feat/phase-3-products-inventory/docs/PHASE_3.md

---

## 12) Como eu posso finalizar / abrir PR
Se quer que eu abra o PR final nesta branch para `main` com checklist (eu posso criar a PR aqui), responda "abrir PR".

Ao abrir PR eu: 
- adiciono a descrição com instruções de migração (docs/PHASE_3.md),
- incluo checklist para validação,
- (opcional) adiciono workflow CI que executa migrations + tests.

Se preferir validar localmente primeiro, execute os passos acima e me envie logs/erros.

---

## 13) Contato / suporte
Se tiver algum erro ao rodar `prisma migrate` ou `npm test`, copie o output e cole aqui — eu irei analisar e ajustar o código ou migrations. Posso também gerar scripts SQL de backfill em caso de dados já existentes.


---

Versão do pacote: entrega consolidada até Fase 3 — branch `feat/phase-3-products-inventory`.

Obrigado — diga "abrir PR" para eu criar o PR final com checklist e (opcional) workflow CI, ou diga "validar local" se prefere executar os passos localmente primeiro e eu te guio.