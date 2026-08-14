import { Router, Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../utils/validation';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import prisma from '../config/database';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, companyName } = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    // Create company
    const company = await prisma.company.create({
      data: {
        name: companyName,
      },
    });

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
        companyId: company.id,
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get(
  '/me',
  authMiddleware,
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(401, 'Not authenticated');
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          companyId: true,
        },
      });

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
