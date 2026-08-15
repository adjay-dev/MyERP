import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { hashPassword, comparePassword } from '../utils/password';
import { createUserSchema, updateUserSchema } from '../utils/userValidation';

describe('Password Utils', () => {
  it('should hash a password', async () => {
    const password = 'SecurePass123';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should verify correct password', async () => {
    const password = 'SecurePass123';
    const hash = await hashPassword(password);
    const isValid = await comparePassword(password, hash);

    expect(isValid).toBe(true);
  });

  it('should fail for incorrect password', async () => {
    const password = 'SecurePass123';
    const hash = await hashPassword(password);
    const isValid = await comparePassword('WrongPassword', hash);

    expect(isValid).toBe(false);
  });
});

describe('User Validation', () => {
  it('should validate correct user data', () => {
    const data = {
      email: 'test@example.com',
      password: 'SecurePass123',
      name: 'Test User',
      role: 'EMPLOYEE',
    };

    expect(() => createUserSchema.parse(data)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const data = {
      email: 'invalid-email',
      password: 'SecurePass123',
      name: 'Test User',
      role: 'EMPLOYEE',
    };

    expect(() => createUserSchema.parse(data)).toThrow();
  });

  it('should reject weak password', () => {
    const data = {
      email: 'test@example.com',
      password: 'weak',
      name: 'Test User',
      role: 'EMPLOYEE',
    };

    expect(() => createUserSchema.parse(data)).toThrow();
  });

  it('should allow partial update', () => {
    const data = {
      name: 'Updated Name',
    };

    expect(() => updateUserSchema.parse(data)).not.toThrow();
  });
});
