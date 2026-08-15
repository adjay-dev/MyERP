import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { updateCompanySchema } from '../utils/userValidation';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// GET: Obter informações da empresa
router.get(
  '/',
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const company = await prisma.company.findUnique({
        where: { id: req.user!.companyId },
        include: {
          users: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          },
        },
      });

      if (!company) {
        throw new AppError(404, 'Empresa não encontrada');
      }

      res.json({
        success: true,
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT: Atualizar informações da empresa
router.put(
  '/',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = updateCompanySchema.parse(req.body);

      const updatedCompany = await prisma.company.update({
        where: { id: req.user!.companyId },
        data: validatedData,
      });

      res.json({
        success: true,
        data: updatedCompany,
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET: Listar usuários da empresa
router.get(
  '/users/list',
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const users = await prisma.user.findMany({
        where: { companyId: req.user!.companyId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
