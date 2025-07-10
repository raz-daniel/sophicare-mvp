import { Router } from 'express';
import { validate } from '../middleware/validation';
import { createTreatment, getTreatmentsByPatient } from '../controllers/treatmentController';
import { createTreatmentSchema, patientTreatmentsParamsSchema } from '../validators/treatmentValidator';

const router = Router({ mergeParams: true }); // Important: merge params to access :patientId

// POST /pro/patients/:patientId/treatments
router.post('/', validate(createTreatmentSchema), createTreatment);

// GET /pro/patients/:patientId/treatments  
router.get('/', validate(patientTreatmentsParamsSchema), getTreatmentsByPatient);

export default router;