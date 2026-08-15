import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware, AuthenticatedRequest, requireRole } from '../middleware/auth';
import { createUserSchema, updateUserSchema } from '../utils/userValidation';
import { hashPassword } from '../utils/password';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// GET: Listar usuários da empresa
router.get(
  '/',
  authMiddleware,
  requireRole(['ADMIN', 'MANAGER']),
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

// GET: Obter usuário por ID
router.get(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN', 'MANAGER']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          companyId: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new AppError(404, 'Usuário não encontrado');
      }

      // Verificar se o usuário pertence à mesma empresa
      if (user.companyId !== req.user!.companyId) {
        throw new AppError(403, 'Acesso negado');
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST: Criar novo usuário
router.post(
  '/',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const validatedData = createUserSchema.parse(req.body);

      // Verificar se email já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        throw new AppError(409, 'Email já registrado');
      }

      // Hash da senha
      const hashedPassword = await hashPassword(validatedData.password);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: validatedData.role,
          companyId: req.user!.companyId,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT: Atualizar usuário
router.put(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const validatedData = updateUserSchema.parse(req.body);

      // Verificar se usuário existe e pertence à empresa
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new AppError(404, 'Usuário não encontrado');
      }

      if (user.companyId !== req.user!.companyId) {
        throw new AppError(403, 'Acesso negado');
      }

      // Se mudar email, verificar se novo email já existe
      if (validatedData.email && validatedData.email !== user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: validatedData.email },
        });

        if (existingUser) {
          throw new AppError(409, 'Email já registrado');
        }
      }

      // Preparar dados para atualizar
      const updateData: any = { ...validatedData };
      if (validatedData.password) {
        updateData.password = await hashPassword(validatedData.password);
      }

      // Atualizar usuário
      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
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
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE: Deletar usuário
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN']),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Verificar se usuário existe
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new AppError(404, 'Usuário não encontrado');
      }

      // Verificar se pertence à empresa
      if (user.companyId !== req.user!.companyId) {
        throw new AppError(403, 'Acesso negado');
      }

      // Não permitir deletar o próprio usuário
      if (user.id === req.user!.id) {
        throw new AppError(400, 'Não pode deletar sua própria conta');
      }

      // Deletar usuário
      await prisma.user.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: 'Usuário deletado com sucesso',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
