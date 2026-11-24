import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[Error Pipeline]', err);

  // Zod validation error
  if (err instanceof ZodError) {
    return sendError(
      res,
      'Validation Error',
      400,
      err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }))
    );
  }

  // Known custom errors
  if (err.statusCode) {
    return sendError(res, err.message, err.statusCode, err.errors || null);
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return sendError(
      res,
      `A record with this ${err.meta?.target || 'field'} already exists.`,
      409
    );
  }

  return sendError(
    res,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred. Please try again.'
      : err.message,
    500
  );
};
