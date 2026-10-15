import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Alerts
router.get('/alerts', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const all = await prisma.product.findMany({ where: { companyId: req.user!.companyId } });
    const lows = all.filter((p) => p.currentStock <= p.minimumStock);
    res.json({ success: true, data: lows });
  } catch (error) {
    next(error);
  }
});

export default router;
