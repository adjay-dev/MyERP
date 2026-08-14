import dotenv from 'dotenv';

dotenv.config();

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
  API_PORT: parseInt(process.env.API_PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  APP_NAME: process.env.APP_NAME || 'MyERP',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
};

// Validate required env vars
const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
