import { z } from "zod";

export const emailValidation = z.string()
    .email('Please enter a valid email address');

export const passwordValidation = z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const firstNameValidation = z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters');

export const lastNameValidation = z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters');

export const loginSchema = z.object({
    email: emailValidation,
    password: passwordValidation.min(1, 'Password is required'),
});

export const registerSchema = z.object({
    firstName: firstNameValidation,
    lastName: lastNameValidation,
    email: emailValidation,
    password: passwordValidation,
});