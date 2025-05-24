import { Router } from 'express';
import { authenticate } from '../middleware/auth';
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

const router = Router();

router.use(authenticate);

router.post('/', validate(createPatientSchema), createPatient);
router.get('/', validate(patientQuerySchema), getPatients);
router.get('/:id', validate(patientParamsSchema), getPatientById);
router.put('/:id', validate(updatePatientSchema), updatePatient);
router.delete('/:id', validate(patientParamsSchema), deletePatient);

export default router; 