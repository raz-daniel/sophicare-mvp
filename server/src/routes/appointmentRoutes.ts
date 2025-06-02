
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} from '../controllers/appointmentController';
import {
    createAppointmentSchema,
    updateAppointmentSchema,
    appointmentParamsSchema,
    appointmentQuerySchema
} from '../validators/appointmentValidator';


const router = Router();
router.use(authenticate);

router.post('/', validate(createAppointmentSchema), createAppointment);
router.get('/', validate(appointmentQuerySchema), getAppointments);
router.get('/:id', validate(appointmentParamsSchema), getAppointmentById);
router.put('/:id', validate(updateAppointmentSchema), updateAppointment);
router.delete('/:id', validate(appointmentParamsSchema), deleteAppointment);

export default router;