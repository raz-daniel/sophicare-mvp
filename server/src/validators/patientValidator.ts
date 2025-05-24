import { z } from 'zod';
import { Gender, MaritalStatus, PatientStatus } from '../models/Patient';
import { validateObjectId } from './common';

const patientBaseSchema = z.object({
    fullName: z.string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name cannot exceed 100 characters')
        .trim(),
    email: z.string()
        .email('Please enter a valid email')
        .toLowerCase()
        .trim()
        .optional(),
    phone: z.string()
        .regex(/^\+?[\d\s\-()]{7,20}$/, 'Please enter a valid phone number')
        .transform(val => val.replace(/[\s\-()]/g, ''))
        .optional(),
    birthDate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, "Invalid date format")
        .transform(val => new Date(val))
        .optional(),
    gender: z.nativeEnum(Gender, {
        errorMap: () => ({ message: 'Please select a valid gender' })
    }).optional(),
    address: z.string()
        .max(200, 'Address cannot exceed 200 characters')
        .trim()
        .optional(),
    occupation: z.string()
        .max(50, 'Occupation cannot exceed 50 characters')
        .trim()
        .optional(),
    maritalStatus: z.nativeEnum(MaritalStatus, {
        errorMap: () => ({ message: 'Please select a valid marital status' })
    }).optional(),
    children: z.string()
        .max(100, 'Children information cannot exceed 100 characters')
        .trim()
        .optional(),
    notes: z.string()
        .max(1000, 'Notes cannot exceed 1000 characters')
        .trim()
        .optional(),
    status: z.nativeEnum(PatientStatus, {
        errorMap: () => ({ message: 'Please select a valid status' })
    }).optional()
});

export const createPatientSchema = z.object({
    body: patientBaseSchema  
});

export const patientParamsSchema = z.object({
    params: z.object({
        id: validateObjectId('Invalid patient ID')
    })
});

export const updatePatientSchema = z.object({
    body: patientBaseSchema.partial(),  
    params: z.object({
        id: validateObjectId('Invalid patient ID')
    })
});

export const patientQuerySchema = z.object({
    status: z.nativeEnum(PatientStatus, {
        errorMap: () => ({ message: 'Please select a valid status' })
    }).optional()
}); 