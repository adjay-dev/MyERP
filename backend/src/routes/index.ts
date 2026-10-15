import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import companyRoutes from './companies';
import productRoutes from './products';
import categoryRoutes from './categories';
import stockRoutes from './stock';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/companies', companyRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/stock', stockRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
