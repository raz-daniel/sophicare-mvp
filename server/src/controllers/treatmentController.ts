import { Request, Response, NextFunction } from 'express';
import { Treatment, SessionStatus } from '../models/Treatment';
import { Patient } from '../models/Patient';
import { AppError } from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { TokenPayload } from '../types/TokenPayload';
import { treatmentService } from '../services/treatmentService';
import { buildPagination } from '../utils/pagination';

export const createTreatment = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { patientId } = req.params;

        const treatment = await treatmentService.createTreatment(req.body, userId, patientId);
        
        res.status(StatusCodes.CREATED).json(treatment);
    } catch (error) {
        next(error);
    }
};

export const getTreatmentsByPatient = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { patientId } = req.params;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        const result = await treatmentService.getTreatmentsByPatient(userId, patientId, page, limit);
        const pagination = buildPagination(page, limit, result.totalCount)

        res.status(StatusCodes.OK).json({
            treatments: result.treatments,
            pagination
        });
    } catch (error) {
        next(error);
    }
};

export const getTreatmentById = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { id } = req.params;

        const treatment = await treatmentService.getTreatmentById(userId, id);

        res.status(StatusCodes.OK).json(treatment);
    } catch (error) {
        next(error);
    }
};

export const updateTreatment = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { id } = req.params;

        const treatment = await treatmentService.updateTreatment(userId, id, req.body)

        res.status(StatusCodes.OK).json(treatment);
    } catch (error) {
        next(error);
    }
};

export const deleteTreatment = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { id } = req.params;

        const treatment = await treatmentService.deleteTreatment(userId, id);

        res.status(StatusCodes.OK).json(treatment);
    } catch (error) {
        next(error);
    }
};

/**
 * Get all highlighted notes for a patient across all treatments
 * Used for patient overview and key insights dashboard
 */
export const getHighlightedNotes = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { id: patientId } = req.params;

        // Verify patient ownership
        const patient = await Patient.findOne({ _id: patientId, userId });
        if (!patient) {
            throw new AppError('Patient not found', StatusCodes.NOT_FOUND);
        }

        const treatments = await Treatment.find({ patientId, userId })
            .sort({ date: -1 });

        const highlightedNotes: any[] = [];
        
        treatments.forEach(treatment => {
            // Patient notes
            treatment.patientNotes?.forEach(note => {
                if (note.importance === 'highlighted') {
                    highlightedNotes.push({
                        treatmentId: treatment.id,
                        treatmentDate: treatment.date,
                        type: 'patientNote',
                        text: note.text,
                        createdAt: note.createdAt
                    });
                }
            });
            
            // Treatment notes
            treatment.treatmentNotes?.forEach(note => {
                if (note.importance === 'highlighted') {
                    highlightedNotes.push({
                        treatmentId: treatment.id,
                        treatmentDate: treatment.date,
                        type: 'treatmentNote',
                        text: note.text,
                        createdAt: note.createdAt
                    });
                }
            });
        });

        res.json({
            highlights: highlightedNotes.sort((a, b) => 
                new Date(b.treatmentDate).getTime() - new Date(a.treatmentDate).getTime()
            ),
            count: highlightedNotes.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get active homework for a patient across all treatments
 * Returns all homework - UI handles filtering by assignedTo
 */
export const getActiveHomework = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { id: patientId } = req.params;

        // Verify patient ownership
        const patient = await Patient.findOne({ _id: patientId, userId });
        if (!patient) {
            throw new AppError('Patient not found', StatusCodes.NOT_FOUND);
        }

        const treatments = await Treatment.find({ patientId, userId })
            .sort({ date: -1 });

        const homework: any[] = [];
        
        treatments.forEach(treatment => {
            treatment.homework?.forEach(hw => {
                // Only include non-finished homework
                if (hw.status !== 'finished') {
                    homework.push({
                        treatmentId: treatment.id,
                        treatmentDate: treatment.date,
                        task: hw.task,
                        assignedTo: hw.assignedTo,
                        status: hw.status,
                        notes: hw.notes
                    });
                }
            });
        });

        res.json({
            homework: homework.sort((a, b) => 
                new Date(b.treatmentDate).getTime() - new Date(a.treatmentDate).getTime()
            ),
            count: homework.length
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update homework status for a specific homework item
 * Used to mark homework as finished, quit, level up, etc.
 */
export const updateHomeworkStatus = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { id: treatmentId } = req.params;
        const { homeworkIndex, status, notes } = req.body;

        const treatment = await Treatment.findOne({ _id: treatmentId, userId });
        if (!treatment) {
            throw new AppError('Treatment not found', StatusCodes.NOT_FOUND);
        }

        if (!treatment.homework || !treatment.homework[homeworkIndex]) {
            throw new AppError('Homework item not found', StatusCodes.NOT_FOUND);
        }

        // Update the specific homework item
        treatment.homework[homeworkIndex].status = status;
        if (notes) {
            treatment.homework[homeworkIndex].notes = notes;
        }

        await treatment.save();

        res.json({
            message: 'Homework status updated successfully',
            homework: treatment.homework[homeworkIndex]
        });
    } catch (error) {
        next(error);
    }
};