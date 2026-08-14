import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  error: Error | AppError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: error.errors,
    });
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }

  return res.status(500).json({
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error',
  });
};
