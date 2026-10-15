import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { createProductSchema, updateProductSchema } from '../utils/productValidation';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// List products (company scoped)
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({
      where: { companyId: req.user!.companyId },
      include: { category: true },
    });

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// Get product
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
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

export default router;
