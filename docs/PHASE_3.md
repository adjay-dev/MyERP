# Phase 3 — Products & Inventory

This document describes how to run and validate Phase 3 (Products & Inventory) added to the repository.

## Migration

1. Ensure you have PostgreSQL running and DATABASE_URL set in `backend/.env`.
2. Generate Prisma client:

```bash
cd backend
npm install
npx prisma generate
```

3. Run migration (dev):

```bash
npx prisma migrate dev --name add-products-stock
```

If you have existing production data, prefer a careful migration strategy (make companyId nullable, backfill, then make required). In development you can reset:

```bash
npx prisma migrate reset
npm run db:seed
```

## Seed

Seed creates a demo company, admin user and a demo product.

```bash
npm run db:seed
```

Default admin credentials: `admin@myerp.local` / `Test1234!`.

## Run

Start backend

```bash
npm run dev
```

Start frontend

```bash
cd ../web
npm install
npm run dev
```

## Smoke tests

1. Health: `GET /api/health`
2. Register/login: `POST /api/auth/register` or use seed admin
3. Products: `GET /api/products` (authorized)
4. Create product (ADMIN): `POST /api/products`
5. Stock movement: `POST /api/stock/movements`
6. Alerts: `GET /api/stock/alerts`

## Notes
- Category model is now company-scoped.
- If migrating existing data, take backup before applying migrations.
