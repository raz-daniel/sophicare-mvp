import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../errors/AppError';
import { ValidationError } from '../types/ValidationError';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        const errorMessages = validationErrors.map(err => 
          `${err.field}: ${err.message}`
        ).join(', ');
        
        next(new AppError(
            `Validation failed - ${errorMessages}`, 
            StatusCodes.BAD_REQUEST,
            'VALIDATION_ERROR',
            validationErrors
          ));
      } else {
        next(error);
      }
    }
  };
};