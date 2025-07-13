import { Router } from 'express';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/auth';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiting';
import { registerSchema, loginSchema, refreshTokenSchema, googleAuthSchema } from '../validators/authValidator';
import { registerController, loginController, refreshTokenController, getCurrentUserController, logoutController, googleAuthController } from '../controllers/authController';

const router = Router();

router.post('/register', registerLimiter, validate(registerSchema), registerController);
router.post('/login', loginLimiter, validate(loginSchema), loginController);
router.post('/refresh', validate(refreshTokenSchema), refreshTokenController);
router.post('/logout', logoutController);
router.get('/me', authenticate, getCurrentUserController);
router.post('/google', validate(googleAuthSchema), googleAuthController);

export default router;