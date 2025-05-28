import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
    createTreatment,
    getTreatmentsByPatient,
    getTreatmentById,
    updateTreatment,
    deleteTreatment,
    getHighlightedNotes,
    getActiveHomework,
    updateHomeworkStatus
} from '../controllers/treatmentController';
import {
    createTreatmentSchema,
    updateTreatmentSchema,
    treatmentParamsSchema,
    patientTreatmentsParamsSchema,
    updateHomeworkSchema  // ← ADD THIS MISSING IMPORT
} from '../validators/treatmentValidator';

const router = Router();
router.use(authenticate);

// LEVEL 1: Most specific routes (3+ segments)
router.get('/patient/:id/highlights', validate(patientTreatmentsParamsSchema), getHighlightedNotes);
router.get('/patient/:id/homework', validate(patientTreatmentsParamsSchema), getActiveHomework);
router.put('/:id/homework', validate(updateHomeworkSchema), updateHomeworkStatus);

// LEVEL 2: Medium specific routes (2 segments) 
router.post('/patient/:id', validate(createTreatmentSchema), createTreatment);
router.get('/patient/:id', validate(patientTreatmentsParamsSchema), getTreatmentsByPatient);

// LEVEL 3: Least specific routes (1 segment - MUST be last)
router.get('/:id', validate(treatmentParamsSchema), getTreatmentById);
router.put('/:id', validate(updateTreatmentSchema), updateTreatment);
router.delete('/:id', validate(treatmentParamsSchema), deleteTreatment);

export default router;