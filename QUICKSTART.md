# QUICKSTART.md - Guia Rápido de Primeiros Passos

## ⚡ 5 Minutos para Começar

### Pré-requisitos

✅ Node.js 20+  
✅ PostgreSQL 14+  
✅ Git  

### Passo 1: Clonar e Entrar no Projeto

```bash
git clone https://github.com/adjay-dev/MyERP.git
cd MyERP
```

### Passo 2: Criar Banco de Dados

```bash
# Windows, macOS e Linux
creatdb -U postgres myerp_dev
```

### Passo 3: Configurar Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

✅ Backend rodando em `http://localhost:3001`

### Passo 4: Configurar Frontend (novo terminal)

```bash
cd web
cp .env.local.example .env.local
npm install
npm run dev
```

✅ Frontend rodando em `http://localhost:3000`

### Passo 5: Login

Acesse http://localhost:3000 e faça login:

**Email**: `admin@demo.com`  
**Senha**: `Admin@123`

---

## 📊 Estrutura do Projeto

```
MyERP/
├── backend/          # API REST (Node.js + Express)
├── web/              # Frontend (Next.js + React)
├── database/         # Migrations
├── docs/             # Documentação
│   ├── SETUP.md      # Instalação detalhada
│   ├── ARCHITECTURE.md
│   └── DEVELOPMENT.md
└── README.md         # Este arquivo
```

---

## 🎯 O que Funciona Agora (Fase 1)

✅ **Autenticação**
- Registro e login
- JWT tokens
- Multi-tenant setup

✅ **Dashboard**
- Sidebar com navegação
- Header com perfil e tema
- Estatísticas básicas

✅ **Database**
- PostgreSQL com Prisma
- Schema completo para todas as fases
- Seed com dados de demonstração

---

## 🚀 Próximas Etapas (Fase 2)

- [ ] Componentes UI (Button, Modal, Table)
- [ ] Sistema de permissões
- [ ] CRUD de empresas
- [ ] Gestão de utilizadores

---

## 🔗 Documentação Completa

- 📖 [Setup Detalhado](./docs/SETUP.md) - Instalação e configuração
- 🏗️ [Arquitetura](./docs/ARCHITECTURE.md) - Visão geral do sistema
- 💻 [Guia de Desenvolvimento](./docs/DEVELOPMENT.md) - Como contribuir

---

## 🆘 Troubleshooting Rápido

### Erro: "database myerp_dev does not exist"

```bash
creatdb -U postgres myerp_dev
```

### Erro: "connect ECONNREFUSED"

PostgreSQL não está rodando. Inicie-o:

```bash
# Windows
psql -U postgres

# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

### Erro: "Port 3000 or 3001 already in use"

```bash
# Linux/macOS
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## 📚 Stack Tecnológico

| Camada | Tecnologia |
|--------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | Express.js, Node.js 20, TypeScript |
| Database | PostgreSQL 14, Prisma ORM |
| Auth | JWT, bcryptjs |
| Validation | Zod |
| Testing | Vitest, Playwright |

---

## 🎓 Exemplos de Código

### Frontend - Usar useAuth

```typescript
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>Olá, {user?.name}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Backend - Criar Novo Endpoint

```typescript
// routes/example.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/items', authMiddleware, async (req, res, next) => {
  try {
    // req.user contém { id, email, role, companyId }
    const items = await prisma.item.findMany({
      where: { companyId: req.user.companyId },
    });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

export default router;
```

---

## 🔐 Credenciais de Teste

| Campo | Valor |
|-------|-------|
| Email | admin@demo.com |
| Senha | Admin@123 |
| Empresa | Demo Company |
| Role | ADMIN |

---

## 📱 URLs Importantes

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Prisma Studio | http://localhost:5555 |
| Health Check | http://localhost:3001/api/health |

---

## 🐳 Usando Docker (Opcional)

```bash
# Iniciar PostgreSQL com Docker
docker-compose up -d postgres

# Ou usar Docker Desktop UI
```

---

## 💡 Dicas Úteis

### Abrir Prisma Studio (GUI para banco)

```bash
cd backend
npm run db:studio
```

### Resetar banco (CUIDADO!)

```bash
cd backend
npm run db:reset
```

### Executar testes

```bash
# Backend
cd backend
npm run test

# Frontend
cd web
npm run test
```

### Formatar código

```bash
# Backend
cd backend
npm run format

# Frontend
cd web
npm run format
```

---

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Commit: `git commit -m 'feat: descrição da feature'`
3. Push: `git push origin feature/sua-feature`
4. Abra um Pull Request

---

## 📞 Suporte

- 📖 Leia [SETUP.md](./docs/SETUP.md) para instalação detalhada
- 🏗️ Consulte [ARCHITECTURE.md](./docs/ARCHITECTURE.md) para entender a estrutura
- 💻 Veja [DEVELOPMENT.md](./docs/DEVELOPMENT.md) para guia de desenvolvimento
- 🐛 Abra uma [issue no GitHub](https://github.com/adjay-dev/MyERP/issues)

---

**Status**: ✅ Fase 1 Completa - Pronto para Desenvolvimento

**Última atualização**: Agosto 2026
