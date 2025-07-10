import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { openaiService } from '../services/openaiServices';
import { AppError } from '../errors/AppError';

export const generateInsight = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sessionSummary } = req.body;

        const insights = await openaiService.generateInsight({ sessionSummary });

        res.status(StatusCodes.OK).json(insights);
        
    } catch (error: any) {
        console.error('AI Error:', error);
        if (error.message?.includes('API key')) {
            throw new AppError('Ai service is temporarily unavailable', StatusCodes.SERVICE_UNAVAILABLE);
        }

        throw new AppError('Failed to analyze session. Please try again.', StatusCodes.INTERNAL_SERVER_ERROR)
    }
}