import { StatusCodes } from 'http-status-codes';
import { IError } from '../types/IError';

export class AppError extends Error implements IError {
  constructor(
    message: string,
    public statusCode: StatusCodes,
    public code?: string,
    public details?: any
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
} 