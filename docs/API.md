# API.md - Documentação da API REST

## 📡 Base URL

```
http://localhost:3001/api
```

Em produção:
```
https://api.seu-dominio.com/api
```

---

## 🔐 Autenticação

Todas as rotas (exceto `/auth/register` e `/auth/login`) requerem JWT token.

### Header

```
Authorization: Bearer <seu_token_jwt>
```

### Exemplo

```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  http://localhost:3001/api/products
```

---

## 📝 Formato de Respostas

### Sucesso (2xx)

```json
{
  "success": true,
  "data": { /* dados */ }
}
```

### Erro (4xx, 5xx)

```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

---

## 🔑 Endpoints de Autenticação

### POST /auth/register

Registrar novo usuário e criar empresa.

**Request**

```json
{
  "email": "usuario@email.com",
  "password": "SecurePass123",
  "name": "João Silva",
  "companyName": "Minha Empresa"
}
```

**Validações**
- Email: válido e único
- Senha: mín 8 caracteres, com maiúscula, minúscula e número
- Nome: mín 2 caracteres
- Empresa: mín 2 caracteres

**Response (201)**

```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "email": "usuario@email.com",
    "name": "João Silva",
    "role": "ADMIN",
    "companyId": "cuid456",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### POST /auth/login

Fazer login com email e senha.

**Request**

```json
{
  "email": "usuario@email.com",
  "password": "SecurePass123"
}
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "email": "usuario@email.com",
    "name": "João Silva",
    "role": "ADMIN",
    "companyId": "cuid456",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response (401)**

```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### GET /auth/me

Obter informações do usuário atual.

**Headers**

```
Authorization: Bearer <token>
```

**Response (200)**

```json
{
  "success": true,
  "data": {
    "id": "cuid123",
    "email": "usuario@email.com",
    "name": "João Silva",
    "role": "ADMIN",
    "companyId": "cuid456"
  }
}
```

**Response (401)**

```json
{
  "success": false,
  "error": "No authentication token provided"
}
```

---

## 🏥 Health Check

### GET /health

Verificar status da API.

**Response (200)**

```json
{
  "status": "ok",
  "timestamp": "2026-08-15T10:30:00Z"
}
```

---

## 📊 Endpoints de Produtos (Fase 3)

*Documentação completa será adicionada na Fase 3*

---

## 👥 Endpoints de Clientes (Fase 4)

*Documentação completa será adicionada na Fase 4*

---

## 💰 Endpoints de Vendas (Fase 5)

*Documentação completa será adicionada na Fase 5*

---

## ⚠️ Códigos de Erro

| Código | Significado |
|--------|-------------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Validação falhou |
| 401 | Unauthorized - Token inválido/expirado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Recurso já existe |
| 500 | Internal Server Error - Erro do servidor |

---

## 🔒 Rate Limiting

*A implementação será feita na Fase 8*

Eventualmente:
- 100 requisições por minuto por IP
- 1000 requisições por hora por usuário autenticado

---

## 📚 Exemplo Completo

### 1. Registrar

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@email.com",
    "password": "SecurePass123",
    "name": "Novo Usuário",
    "companyName": "Minha Empresa"
  }'
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo@email.com",
    "password": "SecurePass123"
  }'
```

### 3. Usar Token

```bash
curl -H "Authorization: Bearer <token_do_login>" \
  http://localhost:3001/api/auth/me
```

---

## 🧪 Testar com Postman

1. Importar [collection](./postman-collection.json)
2. Configurar variável `BASE_URL` = `http://localhost:3001/api`
3. Executar requests

---

## 📖 Swagger/OpenAPI

*Documentação interativa será adicionada na Fase 8*

Acesse: `http://localhost:3001/api/docs`

---

**Última atualização**: Agosto 2026
