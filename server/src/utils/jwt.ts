import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';
import config from '../config/config';
import { AppError } from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';

export interface TokenPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (user: IUser): string => {
  try {
    const payload: TokenPayload = {
      userId: user.id,
      role: user.role
    };
    
    return jwt.sign(payload, config.auth.jwtSecret, { 
      expiresIn: '15m',
      issuer: config.app.name
    });
  } catch (error) {
    throw new AppError(
      'Failed to generate access token', 
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const generateRefreshToken = (user: IUser): string => {
  try {
    const payload: TokenPayload = {
      userId: user.id,
      role: user.role
    };

    return jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: '7d',
      issuer: config.app.name
    });
  } catch (error) {
    throw new AppError(
      'Failed to generate refresh token', 
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, config.auth.jwtSecret, {
      issuer: config.app.name
    }) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(
        'Token has expired', 
        StatusCodes.UNAUTHORIZED,
      );
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(
        'Invalid token', 
        StatusCodes.UNAUTHORIZED,
      );
    } else {
      throw new AppError(
        'Token verification failed', 
        StatusCodes.UNAUTHORIZED,
      );
    }
  }
};