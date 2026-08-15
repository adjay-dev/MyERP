import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter maiúscula')
    .regex(/[a-z]/, 'Deve conter minúscula')
    .regex(/[0-9]/, 'Deve conter número'),
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE', 'ACCOUNTANT']).optional(),
});

export const companySchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const updateUserSchema = userSchema.partial();
export const createUserSchema = userSchema;

export type UserInput = z.infer<typeof userSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
