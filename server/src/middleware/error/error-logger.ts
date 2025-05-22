import { Request, Response, NextFunction } from 'express';
import { IError } from '../../types/IError';

export const errorLogger = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.error('Error:', {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });
      
      next(err);
    };