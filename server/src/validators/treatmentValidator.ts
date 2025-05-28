import { z } from 'zod';
import { 
    SessionStatus, 
    HomeworkTarget, 
    HomeworkStatus, 
    PaymentStatus, 
    ReceiptStatus, 
    AppointmentStatus,
    NoteImportance,
    PaymentMethod
} from '../models/Treatment';
import { validateObjectId } from './common';

// Base schema for common treatment fields
const treatmentBaseSchema = z.object({
    patientId: validateObjectId('Invalid patient ID'),
    date: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, "Invalid date format")
        .transform(val => new Date(val)),
    status: z.nativeEnum(SessionStatus, {
        errorMap: () => ({ message: 'Please select a valid session status' })
    }).optional(),
    patientNotes: z.array(z.object({
        text: z.string().min(1, 'Note text is required'),
        importance: z.nativeEnum(NoteImportance, {
            errorMap: () => ({ message: 'Please select a valid importance level' })
        }).default(NoteImportance.NORMAL),
        createdAt: z.date().optional()
    })).optional(),
    treatmentNotes: z.array(z.object({
        text: z.string().min(1, 'Note text is required'),
        importance: z.nativeEnum(NoteImportance, {
            errorMap: () => ({ message: 'Please select a valid importance level' })
        }).default(NoteImportance.NORMAL),
        createdAt: z.date().optional()
    })).optional(),
    interventions: z.array(z.object({
        method: z.string().min(1, 'Method is required'),
        description: z.string().min(1, 'Description is required')
    })).optional(),
    homework: z.array(z.object({
        task: z.string().min(1, 'Task is required'),
        assignedTo: z.nativeEnum(HomeworkTarget, {
            errorMap: () => ({ message: 'Please select a valid assignment target' })
        }),
        status: z.nativeEnum(HomeworkStatus, {
            errorMap: () => ({ message: 'Please select a valid homework status' })
        }).default(HomeworkStatus.IN_PROGRESS),
        notes: z.string().optional()
    })).optional(),
    attachments: z.array(z.object({
        fileName: z.string().optional(),
        url: z.string().url().optional(),
        uploadedBy: z.enum(['therapist', 'patient']).optional(),
        dateUploaded: z.date().optional(),
        description: z.string().optional(),
        relatedTo: z.string().optional()
    })).optional(),
    administration: z.object({
        price: z.number().optional(),
        payment: z.object({
            status: z.nativeEnum(PaymentStatus, {
                errorMap: () => ({ message: 'Please select a valid payment status' })
            }).default(PaymentStatus.UNPAID),
            method: z.nativeEnum(PaymentMethod, {
                errorMap: () => ({ message: 'Please select a valid payment method' })
            }).optional(),
            notes: z.string().optional()
        }).optional(),
        receipt: z.object({
            status: z.nativeEnum(ReceiptStatus, {
                errorMap: () => ({ message: 'Please select a valid receipt status' })
            }).default(ReceiptStatus.NOT_NEEDED),
            reason: z.string().optional()
        }).optional(),
        nextAppointment: z.object({
            status: z.nativeEnum(AppointmentStatus),
            date: z.string()
                .regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/, "Invalid date format")
                .transform(val => new Date(val))
                .optional(),
        }).optional()
    }).optional()
});

// Schema for creating a new treatment
export const createTreatmentSchema = z.object({
    body: treatmentBaseSchema.omit({ patientId: true }), // ← Remove patientId requirement
    params: z.object({
        id: validateObjectId('Invalid patient ID')
    })
});

// Schema for updating an existing treatment
export const updateTreatmentSchema = z.object({
    body: treatmentBaseSchema.omit({ patientId: true }).partial(),
    params: z.object({
        id: validateObjectId('Invalid treatment ID')
    })
});

// Schema for validating treatment ID in URL params
export const treatmentParamsSchema = z.object({
    params: z.object({
        id: validateObjectId('Invalid treatment ID')
    })
});

// Schema for validating patient ID in URL params
export const patientTreatmentsParamsSchema = z.object({
    params: z.object({
        id: validateObjectId('Invalid patient ID')
    })
}); 

export const updateHomeworkSchema = z.object({
    body: z.object({
        homeworkIndex: z.number().min(0),
        status: z.nativeEnum(HomeworkStatus),
        notes: z.string().optional()
    }),
    params: z.object({
        id: validateObjectId('Invalid treatment ID')
    })
});