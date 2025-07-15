import z from "zod";
import { passwordSchema } from "./passwordValidator";

export const registerSchema = z.object({
    body: z.object({
      firstName: z.string().min(2).max(50),
      lastName: z.string().min(2).max(50),
      email: z.string().email(),
      password: passwordSchema
    })
  });

  export const loginSchema = z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string()
    })
  });

  export const refreshTokenSchema = z.object({
    body: z.object({
      refreshToken: z.string()
    })
  });

  export const googleAuthSchema = z.object({
    body: z.object({
      googleToken: z.string().min(1, 'Googletokem is required')
    })
  })