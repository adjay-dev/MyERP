import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../utils/password';

describe('Password utilities', () => {
  it('should hash a password', async () => {
    const password = 'TestPassword123';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should verify a correct password', async () => {
    const password = 'TestPassword123';
    const hash = await hashPassword(password);
    const isValid = await comparePassword(password, hash);

    expect(isValid).toBe(true);
  });

  it('should fail for incorrect password', async () => {
    const password = 'TestPassword123';
    const hash = await hashPassword(password);
    const isValid = await comparePassword('WrongPassword', hash);

    expect(isValid).toBe(false);
  });
});
