import { passwordSchema } from '../validators/passwordValidator';
import { z } from 'zod';

export const validatePassword = (password: string): string[] => {
  try {
    passwordSchema.parse(password);
    return [];
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return error.errors.map((err: z.ZodIssue) => err.message);
    }
    return ['Password does not meet security requirements'];
  }
};