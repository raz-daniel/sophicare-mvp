import { Router } from 'express';
import { validate } from '../middleware/validation';
import {
    getTreatmentById,
    updateTreatment,
    deleteTreatment
} from '../controllers/treatmentController';
import {
    updateTreatmentSchema,
    treatmentParamsSchema
} from '../validators/treatmentValidator';

const router = Router();

// Individual treatment operations
// GET /pro/treatments/:id
router.get('/:id', validate(treatmentParamsSchema), getTreatmentById);

// PUT /pro/treatments/:id  
router.put('/:id', validate(updateTreatmentSchema), updateTreatment);

// DELETE /pro/treatments/:id
router.delete('/:id', validate(treatmentParamsSchema), deleteTreatment);

// Note: Removed complex features per YAGNI:
// - getHighlightedNotes
// - getActiveHomework  
// - updateHomeworkStatus
// Add back when needed!

export default router;