// validators/appointmentValidator.ts
import { z } from 'zod';
import { SessionType, AppointmentStatus } from '../models/Appointment';
import { validateObjectId } from './common';

const preprocessEmptyString = (val: any) => val === "" ? undefined : val;

// Time validation helper
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

// Base schema without refinements - for partial updates
const appointmentBaseFields = z.object({
   patientId: validateObjectId('Invalid patient ID'),
   date: z.string()
       .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
       .transform(val => new Date(val)),
   startTime: z.string()
       .regex(timeRegex, "Start time must be in HH:MM format (24-hour)"),
   endTime: z.string()
       .regex(timeRegex, "End time must be in HH:MM format (24-hour)"),
   sessionType: z.nativeEnum(SessionType, {
       errorMap: () => ({ message: 'Please select a valid session type' })
   }),
   status: z.nativeEnum(AppointmentStatus, {
       errorMap: () => ({ message: 'Please select a valid status' })
   }).optional().default(AppointmentStatus.SCHEDULED),
   title: z.preprocess(preprocessEmptyString,
       z.string()
           .max(100, 'Title cannot exceed 100 characters')
           .trim()
           .optional()
   ),
   notes: z.preprocess(preprocessEmptyString,
       z.string()
           .max(500, 'Notes cannot exceed 500 characters')
           .trim()
           .optional()
   )
});

// Full schema with refinements - for creation
const appointmentBaseSchema = appointmentBaseFields.refine(
   (data) => {
       // Validate that endTime is after startTime
       const [startHour, startMin] = data.startTime.split(':').map(Number);
       const [endHour, endMin] = data.endTime.split(':').map(Number);
       const startMinutes = startHour * 60 + startMin;
       const endMinutes = endHour * 60 + endMin;
       return endMinutes > startMinutes;
   },
   {
       message: "End time must be after start time",
       path: ["endTime"]
   }
).refine(
   (data) => {
       // Validate appointment duration (15 min to 8 hours)
       const [startHour, startMin] = data.startTime.split(':').map(Number);
       const [endHour, endMin] = data.endTime.split(':').map(Number);
       const startMinutes = startHour * 60 + startMin;
       const endMinutes = endHour * 60 + endMin;
       const duration = endMinutes - startMinutes;
       return duration >= 15 && duration <= 480;
   },
   {
       message: "Appointment duration must be between 15 minutes and 8 hours",
       path: ["endTime"]
   }
);

export const createAppointmentSchema = z.object({
   body: appointmentBaseSchema
});

export const updateAppointmentSchema = z.object({
   body: appointmentBaseFields.partial(),
   params: z.object({
       id: validateObjectId('Invalid appointment ID')
   })
});

export const appointmentParamsSchema = z.object({
   params: z.object({
       id: validateObjectId('Invalid appointment ID')
   })
});

export const appointmentQuerySchema = z.object({
   startDate: z.string()
       .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format")
       .optional(),
   endDate: z.string()
       .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
       .optional(),
   status: z.nativeEnum(AppointmentStatus, {
       errorMap: () => ({ message: 'Please select a valid status' })
   }).optional()
});