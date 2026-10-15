import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório'),
});

export const createProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  barcode: z.string().optional(),
  costPrice: z.number().nonnegative(),
  salePrice: z.number().nonnegative(),
  minimumStock: z.number().int().nonnegative().optional(),
  unit: z.string().optional(),
  categoryId: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createStockMovementSchema = z.object({
  productId: z.string().min(1),
  type: z.enum(['PURCHASE', 'SALE', 'ADJUSTMENT', 'RETURN', 'LOSS']),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateStockMovementInput = z.infer<typeof createStockMovementSchema>;
