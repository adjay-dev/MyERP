import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { createCategorySchema } from '../utils/productValidation';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// List categories
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({ where: { companyId: req.user!.companyId } });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// Create category
router.post('/', authMiddleware, requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = createCategorySchema.parse(req.body);
    const existing = await prisma.category.findFirst({ where: { name: validated.name, companyId: req.user!.companyId } });
    if (existing) throw new AppError(409, 'Categoria já existe');
    const category = await prisma.category.create({ data: { ...validated, companyId: req.user!.companyId } });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

// Update category
router.put('/:id', authMiddleware, requireRole(['ADMIN', 'MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validated = createCategorySchema.parse(req.body);
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || category.companyId !== req.user!.companyId) throw new AppError(404, 'Categoria não encontrada');
    const updated = await prisma.category.update({ where: { id }, data: { name: validated.name } });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// Delete category
router.delete('/:id', authMiddleware, requireRole(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || category.companyId !== req.user!.companyId) throw new AppError(404, 'Categoria não encontrada');
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Categoria deletada' });
  } catch (error) {
    next(error);
  }
});

export default router;
