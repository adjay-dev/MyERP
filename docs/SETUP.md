# SETUP.md - Guia Completo de Instalação

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação Rápida](#instalação-rápida)
3. [Instalação Detalhada](#instalação-detalhada)
4. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
5. [Execução Local](#execução-local)
6. [Troubleshooting](#troubleshooting)
7. [Docker Setup](#docker-setup)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de que possui:

### Software Necessário

- **Git** 2.30+
  ```bash
  git --version
  ```

- **Node.js** 20.x ou superior
  ```bash
  node --version  # v20.0.0 ou superior
  npm --version   # 10.0.0 ou superior
  ```
  
  [Download Node.js](https://nodejs.org/)

- **PostgreSQL** 14.x ou superior
  ```bash
  psql --version  # PostgreSQL 14 ou superior
  ```
  
  [Download PostgreSQL](https://www.postgresql.org/download/)

- **Git** para clonar o repositório

### Hardware Mínimo

- 2GB RAM
- 500MB espaço em disco
- Processador moderno (2+ cores)

---

## ⚡ Instalação Rápida

Para os com pressa:

```bash
# 1. Clonar repositório
git clone https://github.com/adjay-dev/MyERP.git
cd MyERP

# 2. Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev

# 3. Em outro terminal: Frontend
cd web
cp .env.local.example .env.local
npm install
npm run dev

# ✅ Pronto!
# Backend: http://localhost:3001
# Frontend: http://localhost:3000
# Demo: admin@demo.com / Admin@123
```

---

## 📖 Instalação Detalhada

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/adjay-dev/MyERP.git
cd MyERP
```

### Passo 2: Criar Banco de Dados PostgreSQL

#### Windows (cmd ou PowerShell)

```bash
psql -U postgres
```

Depois, na prompt do psql:

```sql
CREATE DATABASE myerp_dev;
CREATE USER myerp_dev WITH PASSWORD 'myerp_dev_password';
ALTER ROLE myerp_dev SET client_encoding TO 'utf8';
ALTER ROLE myerp_dev SET default_transaction_isolation TO 'read committed';
ALTER ROLE myerp_dev SET default_transaction_deferrable TO on;
ALTER ROLE myerp_dev SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE myerp_dev TO myerp_dev_dev;
\q
```

#### macOS/Linux

```bash
# Usando createdb
creatdb -U postgres -O myerp_dev -E UTF8 -l en_US.UTF-8 myerp_dev

# Ou usando psql
psql -U postgres -c "CREATE DATABASE myerp_dev OWNER myerp_dev ENCODING UTF8;"
```

### Passo 3: Instalar e Configurar Backend

```bash
cd backend

# Copiar arquivo de ambiente
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Database
DATABASE_URL=postgresql://myerp_dev:myerp_dev_password@localhost:5432/myerp_dev

# JWT
JWT_SECRET=sua_chave_super_secreta_aqui_change_in_production_min_32_chars_long_very_secure_key_123456789
JWT_EXPIRATION=24h

# API
API_PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# App
APP_NAME=MyERP
APP_VERSION=1.0.0
```

**Importante**: Em produção, gere uma chave JWT segura:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Instale dependências e configure banco:

```bash
# Instalar dependências
npm install

# Executar migrations
npx prisma migrate dev --name init

# Popular banco com dados de teste
npm run db:seed

# (Opcional) Abrir Prisma Studio para visualizar dados
npm run db:studio
```

### Passo 4: Instalar e Configurar Frontend

Em outro terminal:

```bash
cd web

# Copiar arquivo de ambiente
cp .env.local.example .env.local
```

Verifique o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Instale dependências:

```bash
npm install
```

---

## 🗄️ Configuração do Banco de Dados

### Verificar Conexão

```bash
# No diretório backend
npx prisma db execute --stdin
```

Digite:
```sql
SELECT 1;
```

Deveria retornar `1` se a conexão está ok.

### Visualizar Dados

```bash
npm run db:studio
```

Abre uma interface gráfica em `http://localhost:5555`

### Reset do Banco (CUIDADO!)

```bash
# Remove tudo e executa novamente
npm run db:reset
```

### Criar Nova Migration

```bash
# Após alterar schema.prisma
npx prisma migrate dev --name nome_da_migracao
```

---

## 🚀 Execução Local

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Você deverá ver:
```
✅ MyERP API running on http://localhost:3001
📝 Documentation: http://localhost:3001/api/docs
```

### Terminal 2: Frontend

```bash
cd web
npm run dev
```

Você deverá ver:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
```

### Terminal 3: Prisma Studio (Opcional)

```bash
cd backend
npm run db:studio
```

Abre em `http://localhost:5555`

### ✅ Teste de Acesso

1. **Frontend**: http://localhost:3000
   - Redireciona para `/auth/login`

2. **Login com credenciais de demo**:
   - Email: `admin@demo.com`
   - Senha: `Admin@123`

3. **Backend API**: http://localhost:3001/api/health
   - Deve retornar `{ "status": "ok" }`

---

## 🐛 Troubleshooting

### Erro: "connect ECONNREFUSED 127.0.0.1:5432"

**Problema**: PostgreSQL não está rodando

**Solução**:

#### Windows
```bash
# Verificar status
psql -U postgres -d postgres -c "SELECT 1"

# Se não funcionar, reiniciar serviço PostgreSQL
# Services > PostgreSQL > Restart
```

#### macOS
```bash
# Usando Homebrew
brew services restart postgresql@14

# Ou manualmente
pg_ctl -D /usr/local/var/postgres start
```

#### Linux
```bash
sudo systemctl restart postgresql
```

### Erro: "database myerp_dev does not exist"

**Solução**: Recriar banco de dados

```bash
psql -U postgres -c "DROP DATABASE IF EXISTS myerp_dev;"
psql -U postgres -c "CREATE DATABASE myerp_dev OWNER myerp_dev ENCODING UTF8;"
cd backend
npx prisma migrate dev --name init
npm run db:seed
```

### Erro: "CORS error" ou "Cross-Origin Request Blocked"

**Problema**: Frontend e backend em portas diferentes

**Verificar**:
1. Backend `.env`: `CORS_ORIGIN=http://localhost:3000`
2. Frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:3001/api`
3. Ambos rodando localmente

### Erro: "Module not found"

**Solução**:
```bash
# Limpar node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

### Erro: "Port 3000 or 3001 already in use"

**Solução Windows**:
```bash
# Encontrar processo na porta
netstat -ano | findstr :3001

# Matar processo (PID = <PID>)
taskkill /PID <PID> /F
```

**Solução macOS/Linux**:
```bash
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Erro: "JWT_SECRET is missing"

**Solução**: Adicione JWT_SECRET no `.env`
```bash
# Gerar chave segura
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copie o resultado e adicione ao .env
```

---

## 🐳 Docker Setup

### Pré-requisito: Docker instalado

```bash
docker --version
docker-compose --version
```

[Download Docker](https://www.docker.com/products/docker-desktop)

### Executar com Docker Compose

```bash
# Na raiz do projeto
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f postgres
```

### Acessar banco no container

```bash
docker-compose exec postgres psql -U myerp_dev -d myerp_dev
```

### Parar containers

```bash
docker-compose down

# Com remoção de volumes (CUIDADO - deleta dados)
docker-compose down -v
```

### Dockerfile para Backend

Um exemplo de Dockerfile para o backend:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

### Dockerfile para Frontend

Um exemplo para o frontend:

```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

---

## ✅ Checklist de Setup Completo

- [ ] Node.js 20+ instalado
- [ ] PostgreSQL 14+ instalado e rodando
- [ ] Repositório clonado
- [ ] Backend `.env` configurado
- [ ] Frontend `.env.local` configurado
- [ ] Banco de dados criado
- [ ] Migrations executadas
- [ ] Seed executado
- [ ] Backend rodando em `http://localhost:3001`
- [ ] Frontend rodando em `http://localhost:3000`
- [ ] Login funcionando com `admin@demo.com`
- [ ] Dashboard carregando corretamente

---

## 📚 Próximos Passos

1. Leia [ARCHITECTURE.md](./ARCHITECTURE.md) para entender a estrutura
2. Veja [API.md](./API.md) para documentação dos endpoints
3. Consulte [DEVELOPMENT.md](./DEVELOPMENT.md) para guia de desenvolvimento

---

## 🆘 Precisa de Ajuda?

- Abra uma [issue no GitHub](https://github.com/adjay-dev/MyERP/issues)
- Verifique o [README.md](../README.md) principal
- Consulte a [documentação oficial do Next.js](https://nextjs.org/docs)
- Consulte a [documentação oficial do Express](https://expressjs.com/)
- Consulte a [documentação do Prisma](https://www.prisma.io/docs/)

---

**Última atualização**: Agosto 2026
