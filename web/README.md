# MyERP Web Frontend 🎨

Interface Web moderna para o sistema MyERP, desenvolvido com Next.js, React, TypeScript e Tailwind CSS.

## 🛠️ Tecnologias

- **Next.js** 14+ (Framework React)
- **React** 18+ (UI Library)
- **TypeScript** 5+ (Type safety)
- **Tailwind CSS** 3+ (Styling)
- **Zod** (Validação)
- **Axios** (HTTP Client)
- **Vitest** (Unit tests)
- **Playwright** (E2E tests)

## 📦 Requisitos

- Node.js 20.x ou superior
- npm 10.x ou superior

## 🚀 Instalação

### 1. Instalar dependências

```bash
cd web
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🏃 Executar

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

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
npm run build        # Compilar para produção
npm start            # Executar versão compilada

# Testes
npm run test         # Executar testes unitários
npm run test:ui      # Executar testes com UI
npm run test:e2e     # Executar testes E2E

# Linting
npm run lint         # Verificar lint
```

## 🗂️ Estrutura de Pastas

```
src/
├── app/                     # Next.js app directory
│   ├── (auth)/             # Páginas de autenticação
│   ├── (dashboard)/        # Páginas do dashboard
│   ├── layout.tsx          # Layout raiz
│   └── globals.css         # Estilos globais
├── components/             # Componentes reutilizáveis
│   ├── common/             # Componentes comuns
│   ├── layout/             # Componentes de layout
│   ├── ui/                 # Componentes UI
│   └── Providers.tsx       # Providers da aplicação
├── contexts/               # Context API
│   ├── AuthContext.tsx     # Contexto de autenticação
│   └── ThemeContext.tsx    # Contexto de tema
├── hooks/                  # Custom hooks
├── services/               # Serviços e API calls
│   ├── api.ts             # Cliente HTTP
│   └── auth.ts            # Serviço de autenticação
├── types/                  # TypeScript types
├── utils/                  # Funções utilitárias
├── styles/                 # Estilos globais
public/                     # Arquivos estáticos
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

1. Usuário faz login
2. Backend retorna um token JWT
3. Token é armazenado no localStorage
4. Token é enviado em todas as requisições via header `Authorization: Bearer <token>`
5. Se o token expirar (401), o usuário é redirecionado para login

## 🎨 Tema Claro/Escuro

O sistema suporta tema claro e escuro:

- Tema é alterado via botão no header
- Preferência é salva no localStorage
- Tailwind CSS dark mode ativado

## 🔗 Integração com Backend

O frontend se conecta ao backend via API REST:

- **Base URL**: `http://localhost:3001/api` (configurável via `.env.local`)
- **Autenticação**: JWT via header `Authorization`
- **Formato de resposta**: JSON padronizado

## 🧪 Testes

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

## 🚀 Deploy

O frontend pode ser deployado em qualquer plataforma que suporte Node.js:

- Vercel (recomendado para Next.js)
- Netlify
- GitHub Pages
- Docker
- Qualquer servidor com Node.js

## 🐳 Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Páginas Implementadas

- ✅ `/auth/login` - Página de login
- ✅ `/auth/register` - Página de registro
- ✅ `/dashboard` - Dashboard principal
- ⏳ `/products` - Gestão de produtos (Fase 3)
- ⏳ `/customers` - Gestão de clientes (Fase 4)
- ⏳ `/sales` - Gestão de vendas (Fase 5)
- ⏳ `/invoices` - Gestão de faturas (Fase 5)

## 🔄 Fluxo de Autenticação

```
Usuário
  ↓
Página de Login
  ↓
Submete credenciais
  ↓
AuthService.login()
  ↓
Backend: POST /api/auth/login
  ↓
Backend retorna token + usuário
  ↓
Tokeno armazenado no localStorage
  ↓
Context atualizado com usuário
  ↓
Redirecionado para /dashboard
  ↓
Sidebar + Header + Conteúdo renderizados
```

## 💡 Boas Práticas

- Use componentes reutilizáveis
- Sempre tipifique com TypeScript
- Use Zod para validações
- Isolate business logic em services
- Use Context API para estado global
- Implemente error boundaries
- Sempre teste componentes

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.
