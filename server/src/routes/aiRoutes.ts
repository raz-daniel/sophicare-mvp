import { Router } from 'express';
import { generateInsight } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { generateInsightSchema } from '../validators/aiValidator';

const router = Router();

router.use(authenticate);

router.post('/insights', validate(generateInsightSchema), generateInsight);

export default router;