import { Request, Response, NextFunction } from 'express';
import { Patient, PatientStatus } from '../models/Patient';
import { AppError } from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { patientQuerySchema } from '../validators/patientValidator';
import { TokenPayload } from '../types/TokenPayload';

export const createPatient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.user as TokenPayload;
        const patient = await Patient.create({
            ...req.body,
            userId
        });

        res.status(StatusCodes.CREATED).json(patient);
    } catch (error) {
        next(error);
    }
};

interface PatientFilter {
    userId: string;
    status?: PatientStatus;
}

export const getPatients = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.user as TokenPayload;
        const query = patientQuerySchema.parse(req.query);
        
        const filter: PatientFilter = { userId };
        if (query.status) {
            filter.status = query.status;
        }

        const patients = await Patient.find(filter)
            .sort({ lastTreatmentDate: -1, createdAt: -1 });

        const count = await Patient.countDocuments(filter);

        res.json({
            patients,
            count
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            next(new AppError('Invalid query parameters', StatusCodes.BAD_REQUEST));
            return;
        }
        next(error);
    }
};

export const getPatientById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.user as TokenPayload;
        const patient = await Patient.findOne({
            _id: req.params.id,
            userId
        });

        if (!patient) {
            throw new AppError('Patient not found', StatusCodes.NOT_FOUND);
        }

        res.json(patient);
    } catch (error) {
        next(error);
    }
};

export const updatePatient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.user as TokenPayload;
        if (req.body.userId) {
            throw new AppError(
                'Cannot change patient ownership',
                StatusCodes.BAD_REQUEST
            );
        }

        const patient = await Patient.findOneAndUpdate(
            {
                _id: req.params.id,
                userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!patient) {
            throw new AppError('Patient not found', StatusCodes.NOT_FOUND);
        }

        res.json(patient);
    } catch (error) {
        next(error);
    }
};

export const deletePatient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId } = req.user as TokenPayload;
        const patient = await Patient.findOneAndUpdate(
            {
                _id: req.params.id,
                userId
            },
            { status: PatientStatus.DISCHARGED },
            {
                new: true,
                runValidators: true
            }
        );

        if (!patient) {
            throw new AppError('Patient not found', StatusCodes.NOT_FOUND);
        }

        res.json({
            message: 'Patient successfully discharged'
        });
    } catch (error) {
        next(error);
    }
}; 