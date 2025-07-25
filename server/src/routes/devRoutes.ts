import { memoryHealthCheck, memoryLeakTest, memoryStatus } from '../controllers/devController';
import { Router } from 'express';

const router = Router();

router.get('/memory', memoryStatus)
router.get('/memory-leak', memoryLeakTest)
router.get('/health-check', memoryHealthCheck);

export default router;
