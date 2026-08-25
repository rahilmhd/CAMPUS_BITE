import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Unhandled Exception:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'An internal server error occurred';

  ApiResponse.error(res, message, statusCode);
};
