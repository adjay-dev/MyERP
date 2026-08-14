import express from 'express';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import { env } from './config/env';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(corsMiddleware);

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    app: env.APP_NAME,
    version: env.APP_VERSION,
    status: 'running',
  });
});

// Error handling
app.use(errorHandler);

// Start server
const port = env.API_PORT;
app.listen(port, () => {
  console.log(`✅ ${env.APP_NAME} API running on http://localhost:${port}`);
  console.log(`📝 Documentation: http://localhost:${port}/api/docs`);
});
