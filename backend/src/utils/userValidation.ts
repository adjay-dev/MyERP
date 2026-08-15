import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter maiúscula')
    .regex(/[a-z]/, 'Deve conter minúscula')
    .regex(/[0-9]/, 'Deve conter número'),
  name: z.string().min(2, 'Mínimo 2 caracteres'),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE', 'ACCOUNTANT']),
});

export const updateUserSchema = createUserSchema.partial();

export const updateCompanySchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
