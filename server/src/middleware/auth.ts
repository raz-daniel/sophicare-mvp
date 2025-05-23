import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { UserRole } from '../models/User';
import { AppError } from '../errors/AppError';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', StatusCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError(
          'Authentication required', 
          StatusCodes.UNAUTHORIZED
        );
      }

      if (!roles.includes(req.user.role as UserRole)) {
        throw new AppError(
          'Insufficient permissions', 
          StatusCodes.FORBIDDEN
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAuth = authenticate;
export const requireRoles = (...roles: UserRole[]) => {
  return [authenticate, authorize(...roles)];
};