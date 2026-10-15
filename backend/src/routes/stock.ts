import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { createStockMovementSchema } from '../utils/productValidation';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// List stock (summary)
router.get('/', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const products = await prisma.product.findMany({ where: { companyId: req.user!.companyId }, select: { id: true, sku: true, name: true, currentStock: true, minimumStock: true } });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// Create stock movement (purchase/sale/adjustment)
router.post('/movements', authMiddleware, requireRole(['ADMIN','MANAGER']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validated = createStockMovementSchema.parse(req.body);

    const product = await prisma.product.findUnique({ where: { id: validated.productId } });
    if (!product || product.companyId !== req.user!.companyId) throw new AppError(404, 'Produto não encontrado');

    // Determine sign
    const isIncoming = validated.type === 'PURCHASE' || validated.type === 'RETURN' || validated.type === 'ADJUSTMENT';
    const change = isIncoming ? validated.quantity : -validated.quantity;

    // Check stock for outgoing
    if (!isIncoming && product.currentStock < validated.quantity) {
      throw new AppError(400, 'Estoque insuficiente');
    }

    const previousStock = product.currentStock;
    const newStock = previousStock + change;

    await prisma.$transaction(async (tx) => {
      await tx.stockMovement.create({ data: {
        productId: product.id,
        companyId: req.user!.companyId,
        userId: req.user!.id,
        type: validated.type as any,
        quantity: validated.quantity,
        unit: product.unit,
        previousStock,
        newStock,
        note: validated.note,
      }});

      await tx.product.update({ where: { id: product.id }, data: { currentStock: newStock } });
    });

    res.status(201).json({ success: true, data: { productId: product.id, previousStock, newStock } });
  } catch (error) {
    next(error);
  }
});

// List movements
router.get('/movements', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.query as any;
    const where: any = { companyId: req.user!.companyId };
    if (productId) where.productId = productId;
    const movements = await prisma.stockMovement.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 });
    res.json({ success: true, data: movements });
  } catch (error) {
    next(error);
  }
});

// Alerts
router.get('/alerts', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const low = await prisma.product.findMany({ where: { companyId: req.user!.companyId, currentStock: { lte: prisma.literal ? 0 : 0 }, }, select: { id: true, name: true, currentStock: true, minimumStock: true } });
    // Note: prisma.literal used above is a placeholder; fallback to direct comparison
    // Simpler implementation:
    const lowProducts = await prisma.product.findMany({ where: { companyId: req.user!.companyId, currentStock: { lte: prisma.raw ? undefined as any : undefined as any } } }).catch(()=>[]);

    // To avoid complex raw usage, compute low-stock in JS
    const all = await prisma.product.findMany({ where: { companyId: req.user!.companyId } });
    const lows = all.filter(p => p.currentStock <= p.minimumStock);

    res.json({ success: true, data: lows });
  } catch (error) {
    next(error);
  }
});

export default router;
