import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../models/User';
import { register } from '../auth/registerUser';
import { login } from '../auth/loginUser';
import { refreshToken as refreshUserToken } from '../auth/refreshUserToken';

export async function registerController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await register(req.body);
        res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        next(error);
    }
}

export async function loginController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await login(req.body);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export async function refreshTokenController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new AppError('Refresh token is required', StatusCodes.BAD_REQUEST);
        }

        const result = await refreshUserToken(refreshToken);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        next(error);
    }
}

export async function getCurrentUserController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.user) {
            throw new AppError('Not authenticated', StatusCodes.UNAUTHORIZED);
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            throw new AppError('User not found', StatusCodes.NOT_FOUND);
        }

        res.status(StatusCodes.OK).json({ user: user.toObject() });
    } catch (error) {
        next(error);
    }
}

export async function logoutController(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        res.status(StatusCodes.OK).json({
            message: 'Logged out successfully',
            success: true
        });
    } catch (error) {
        next(error);
    }
}