import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppError';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(
    `Not Found - ${req.originalUrl}`,
    StatusCodes.NOT_FOUND
  );
  next(error);
}; 