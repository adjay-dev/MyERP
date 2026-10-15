import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { createProductSchema, updateProductSchema } from '../utils/productValidation';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// List products (company scoped)
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { search, categoryId, lowStock } = req.query as any;
    const where: any = { companyId: req.user!.companyId };
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }];
    if (categoryId) where.categoryId = categoryId;
    if (lowStock === 'true') where.currentStock = { lte: prisma.raw ? undefined as any : undefined as any }; // placeholder

    // Simpler: fetch then filter in JS for lowStock
    let products = await prisma.product.findMany({ where, include: { category: true } });
    if (lowStock === 'true') products = products.filter(p => p.currentStock <= p.minimumStock);

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// Get product
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product || product.companyId !== req.user!.companyId) {
      throw new AppError(404, 'Produto não encontrado');
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// Create product (ADMIN/MANAGER)
router.post('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = createProductSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        ...validated,
        companyId: req.user!.companyId,
        currentStock: 0,
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// Update product
router.put('/:id', authMiddleware, requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = updateProductSchema.parse(req.body);

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.companyId !== req.user!.companyId) {
      throw new AppError(404, 'Produto não encontrado');
    }

    const updated = await prisma.product.update({ where: { id }, data: validated });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Delete product
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.companyId !== req.user!.companyId) {
      throw new AppError(404, 'Produto não encontrado');
    }

    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Produto deletado com sucesso' });
  } catch (error) {
    next(error);
  }
});

// Adjust stock (ADMIN only) - creates a StockMovement and updates stock atomically
router.patch('/:id/adjust-stock', authMiddleware, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { quantity, type, note } = req.body as { quantity: number; type: 'ADJUSTMENT' | 'LOSS' | 'RETURN' | 'PURCHASE' | 'SALE'; note?: string };
    if (!quantity || typeof quantity !== 'number') throw new AppError(400, 'Quantity is required');
    if (!type) throw new AppError(400, 'Type is required');

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product || product.companyId !== req.user!.companyId) throw new AppError(404, 'Produto não encontrado');

    const isIncoming = type === 'PURCHASE' || type === 'RETURN' || type === 'ADJUSTMENT';
    const change = isIncoming ? quantity : -quantity;

    if (!isIncoming && product.currentStock < quantity) throw new AppError(400, 'Estoque insuficiente');

    const previousStock = product.currentStock;
    const newStock = previousStock + change;

    await prisma.$transaction(async (tx) => {
      await tx.stockMovement.create({ data: {
        productId: product.id,
        companyId: req.user!.companyId,
        userId: req.user!.id,
        type,
        quantity,
        unit: product.unit,
        previousStock,
        newStock,
        note,
      }});

      await tx.product.update({ where: { id: product.id }, data: { currentStock: newStock } });
    });

    res.json({ success: true, data: { productId: product.id, previousStock, newStock } });
  } catch (error) {
    next(error);
  }
});

export default router;
