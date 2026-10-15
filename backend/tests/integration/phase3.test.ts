import request from 'supertest';
import app from '../../src/index';
import prisma from '../../config/database';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Phase 3 Integration Tests', () => {
  let token: string;
  let productId: string;

  beforeAll(async () => {
    // nothing; assumes DATABASE_URL and JWT_SECRET are set in env
  });

  it('should register a new admin and return token', async () => {
    const email = `test+${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'Test1234!', name: 'Test Admin', companyName: `Co-${Date.now()}` });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    token = res.body.data.token;
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ sku: `TST-${Date.now()}`, name: 'Integration Product', costPrice: 5.0, salePrice: 8.0 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    productId = res.body.data.id;
  });

  it('should create a purchase movement and increase stock', async () => {
    const res = await request(app)
      .post('/api/stock/movements')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, type: 'PURCHASE', quantity: 15 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.newStock).toBeGreaterThanOrEqual(15);
  });

  it('should prevent selling more than available stock', async () => {
    const res = await request(app)
      .post('/api/stock/movements')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, type: 'SALE', quantity: 999999 });

    expect(res.status).toBe(400);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
