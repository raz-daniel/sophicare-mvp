// controllers/appointmentController.ts
import { Request, Response, NextFunction } from 'express';
import { Appointment, AppointmentStatus } from '../models/Appointment';
import { AppError } from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { TokenPayload } from '../types/TokenPayload';

export const createAppointment = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId: therapistId } = req.user as TokenPayload;
        
        const appointment = await Appointment.create({
            ...req.body,
            therapistId
        });

        // Populate patient info for response
        await appointment.populate('patientId', 'firstName lastName');

        res.status(StatusCodes.CREATED).json(appointment);
    } catch (error) {
        next(error);
    }
};

export const getAppointments = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId: therapistId } = req.user as TokenPayload;
        const { startDate, endDate, status } = req.query;

        let filter: any = { therapistId };
        
        // Date range filter
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate as string);
            if (endDate) filter.date.$lte = new Date(endDate as string);
        }
        
        // Status filter
        if (status) filter.status = status;

        const appointments = await Appointment.find(filter)
            .populate('patientId', 'firstName lastName')
            .sort({ date: 1, startTime: 1 });

        res.json({
            appointments,
            count: appointments.length
        });
    } catch (error) {
        next(error);
    }
};

export const getAppointmentById = async ( req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId: therapistId } = req.user as TokenPayload;
        const { id } = req.params;

        const appointment = await Appointment.findOne({ 
            _id: id, 
            therapistId 
        }).populate('patientId', 'firstName lastName');

        if (!appointment) {
            throw new AppError('Appointment not found', StatusCodes.NOT_FOUND);
        }

        res.json(appointment);
    } catch (error) {
        next(error);
    }
};

export const updateAppointment = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId: therapistId } = req.user as TokenPayload;
        const { id } = req.params;

        // Prevent changing therapist
        if (req.body.therapistId) {
            throw new AppError(
                'Cannot change appointment therapist',
                StatusCodes.BAD_REQUEST
            );
        }

        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, therapistId },
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('patientId', 'firstName lastName');

        if (!appointment) {
            throw new AppError('Appointment not found', StatusCodes.NOT_FOUND);
        }

        res.json(appointment);
    } catch (error) {
        next(error);
    }
};

export const deleteAppointment = async (req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId: therapistId } = req.user as TokenPayload;
        const { id } = req.params;

        const appointment = await Appointment.findOneAndUpdate(
            { _id: id, therapistId },
            { status: AppointmentStatus.CANCELLED },
            {
                new: true,
                runValidators: true
            }
        );

        if (!appointment) {
            throw new AppError('Appointment not found', StatusCodes.NOT_FOUND);
        }

        res.json({
            message: 'Appointment successfully cancelled'
        });
    } catch (error) {
        next(error);
    }
};