import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import patientRoutes from './patientRoutes';
import treatmentRoutes from './treatmentRoutes';
import appointmentRoutes from './appointmentRoutes';

const router = Router();

router.use(authenticate);

router.use('/patients', patientRoutes);
router.use('/treatments', treatmentRoutes);
router.use('/appointments', appointmentRoutes);

export default router;