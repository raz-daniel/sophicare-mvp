import { z } from 'zod';
import { SessionType } from '../types/appointment';

const preprocessEmptyString = (val: any) => val === "" ? undefined : val;

const objectIdValidation = z.string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Please select a valid patient');

const dateValidation = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
const timeValidation = z.string()
  .regex(timeRegex, "Time must be in HH:MM format");

const titleValidation = z.preprocess(
  preprocessEmptyString,
  z.string()
    .max(100, 'Title cannot exceed 100 characters')
    .trim()
    .optional()
);

const notesValidation = z.preprocess(
  preprocessEmptyString,
  z.string()
    .max(500, 'Notes cannot exceed 500 characters')
    .trim()
    .optional()
);

const validateDuration = (startTime: string, endTime: string, date: string, endDate?: string): boolean => {
  const appointmentDate = new Date(date);
  const finalDate = endDate ? new Date(endDate) : appointmentDate;
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startDateTime = new Date(appointmentDate);
  startDateTime.setHours(startHour, startMin, 0, 0);
  
  const endDateTime = new Date(finalDate);
  endDateTime.setHours(endHour, endMin, 0, 0);
  
  const durationMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
  return durationMinutes >= 5 && durationMinutes <= 10080;
};

const validateTimeOrder = (startTime: string, endTime: string, date: string, endDate?: string): boolean => {
  const appointmentDate = new Date(date);
  const finalDate = endDate ? new Date(endDate) : appointmentDate;
  
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startDateTime = new Date(appointmentDate);
  startDateTime.setHours(startHour, startMin, 0, 0);
  
  const endDateTime = new Date(finalDate);
  endDateTime.setHours(endHour, endMin, 0, 0);
  
  return endDateTime > startDateTime;
};

export const isAppointmentInPast = (date: string, startTime: string): boolean => {
  const appointmentDate = new Date(date);
  const [startHour, startMin] = startTime.split(':').map(Number);
  const startDateTime = new Date(appointmentDate);
  startDateTime.setHours(startHour, startMin, 0, 0);
  
  return startDateTime < new Date();
};

export const createAppointmentFormSchema = z.object({
  patientId: objectIdValidation,
  date: dateValidation,
  startTime: timeValidation,
  endTime: timeValidation,
  sessionType: z.nativeEnum(SessionType, {
    errorMap: () => ({ message: 'Please select a valid session type' })
  }),
  title: titleValidation,
  notes: notesValidation
}).refine(
  (data) => validateTimeOrder(data.startTime, data.endTime, data.date),
  {
    message: "End time must be after start time",
    path: ["endTime"]
  }
).refine(
  (data) => validateDuration(data.startTime, data.endTime, data.date),
  {
    message: "Appointment duration must be between 5 minutes and 7 days",
    path: ["endTime"]
  }
);

export const createMultiDayAppointmentFormSchema = z.object({
  patientId: objectIdValidation,
  date: dateValidation,
  endDate: dateValidation,
  startTime: timeValidation,
  endTime: timeValidation,
  sessionType: z.nativeEnum(SessionType, {
    errorMap: () => ({ message: 'Please select a valid session type' })
  }),
  title: titleValidation,
  notes: notesValidation
}).refine(
  (data) => {
    const startDate = new Date(data.date);
    const endDate = new Date(data.endDate);
    return endDate >= startDate;
  },
  {
    message: "End date must be same day or after start date",
    path: ["endDate"]
  }
).refine(
  (data) => validateTimeOrder(data.startTime, data.endTime, data.date, data.endDate),
  {
    message: "End time must be after start time",
    path: ["endTime"]
  }
).refine(
  (data) => validateDuration(data.startTime, data.endTime, data.date, data.endDate),
  {
    message: "Appointment duration must be between 5 minutes and 7 days",
    path: ["endTime"]
  }
);

export type CreateAppointmentFormData = z.infer<typeof createAppointmentFormSchema>;
export type CreateMultiDayAppointmentFormData = z.infer<typeof createMultiDayAppointmentFormSchema>;