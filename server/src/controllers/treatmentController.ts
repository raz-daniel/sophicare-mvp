import { Request, Response, NextFunction } from 'express';
import { Treatment, SessionStatus } from '../models/Treatment';
import { Patient } from '../models/Patient';
import { AppError } from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { TokenPayload } from '../types/TokenPayload';

/**
 * Create a new treatment record for a patient
 * Verifies patient ownership before creation
 */
export const createTreatment = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { patientId } = req.params;

        // Verify patient ownership
        const patient = await Patient.findOne({ _id: patientId, userId });

        if (!patient) {
            throw new AppError('Patient not found', StatusCodes.NOT_FOUND);
        }

        const treatment = await Treatment.create({
            ...req.body,
            userId,
            patientId
        });

        await Patient.findByIdAndUpdate(patientId, {
            lastTreatmentDate: new Date(),
            $inc: { treatmentCount: 1 }
        });
        
        res.status(StatusCodes.CREATED).json(treatment);
    } catch (error) {
        next(error);
    }
};

/**
 * Get all treatments for a specific patient
 * Verifies patient ownership before fetching treatments
 */
export const getTreatmentsByPatient = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { patientId } = req.params;

        // Verify patient ownership
        const patient = await Patient.findOne({ _id: patientId, userId });
        if (!patient) {
            throw new AppError('Patient not found', StatusCodes.NOT_FOUND);
        }

        const treatments = await Treatment.find({ patientId, userId })
            .sort({ date: -1, createdAt: -1 });

        const count = await Treatment.countDocuments({ patientId, userId });

        res.json({
            treatments,
            count
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single treatment by ID
 * Verifies treatment belongs to therapist's patient
 */
export const getTreatmentById = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { id: treatmentId } = req.params;

        const treatment = await Treatment.findOne({ _id: treatmentId, userId });
        if (!treatment) {
            throw new AppError('Treatment not found', StatusCodes.NOT_FOUND);
        }

        res.json(treatment);
    } catch (error) {
        next(error);
    }
};

/**
 * Update a treatment record
 * Verifies ownership and prevents patientId/userId changes
 */
export const updateTreatment = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { id: treatmentId } = req.params;

        // Prevent patientId and userId changes
        if (req.body.patientId || req.body.userId) {
            throw new AppError(
                'Cannot change treatment ownership or patient',
                StatusCodes.BAD_REQUEST
            );
        }

        const treatment = await Treatment.findOneAndUpdate(
            { _id: treatmentId, userId },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!treatment) {
            throw new AppError('Treatment not found', StatusCodes.NOT_FOUND);
        }

        res.json(treatment);
    } catch (error) {
        next(error);
    }
};

/**
 * Soft delete a treatment by setting status to CANCELLED
 * Verifies ownership before updating
 */
export const deleteTreatment = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const { userId } = req.user as TokenPayload;
        const { id: treatmentId } = req.params;

        const treatment = await Treatment.findOneAndUpdate(
            { _id: treatmentId, userId },
            { status: SessionStatus.CANCELLED },
            {
                new: true,
                runValidators: true
            }
        );

        if (!treatment) {
            throw new AppError('Treatment not found', StatusCodes.NOT_FOUND);
        }

        res.json({
            message: 'Treatment successfully cancelled'
        });
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