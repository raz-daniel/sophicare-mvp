import { Router } from 'express';
import { validate } from '../middleware/validation';
import {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
} from '../controllers/patientController';
import {
    createPatientSchema,
    updatePatientSchema,
    patientParamsSchema,
    patientQuerySchema
} from '../validators/patientValidator';
import treatmentRoutes from './nestedTreatmentRoutes';

const router = Router();

// Patient CRUD operations
router.post('/', validate(createPatientSchema), createPatient);
router.get('/', validate(patientQuerySchema), getPatients);
router.get('/:id', validate(patientParamsSchema), getPatientById);
router.put('/:id', validate(updatePatientSchema), updatePatient);
router.delete('/:id', validate(patientParamsSchema), deletePatient);

// Nested routes for patient treatments
router.use('/:patientId/treatments', treatmentRoutes);

export default router;