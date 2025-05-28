import { Document, Schema, model } from 'mongoose';
import { AppError } from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { Patient } from './Patient';

export enum SessionStatus {
    PLANNED = 'planned',
    IN_PROGRESS = 'inProgress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum HomeworkTarget {
    PATIENT = 'patient',
    THERAPIST = 'therapist',
    BOTH = 'both'
}

export enum HomeworkStatus {
    IN_PROGRESS = 'inProgress',
    FINISHED = 'finished',
    QUIT = 'quit',
    LEVEL_UP = 'levelUp',
    LEVEL_DOWN = 'levelDown'
}

export enum PaymentStatus {
    PAID = 'paid',
    UNPAID = 'unpaid',
    PENDING = 'pending',
    PARTIALLY_PAID = 'partiallyPaid'
}

export enum ReceiptStatus {
    SENT = 'sent',
    HELD = 'held',
    NOT_NEEDED = 'notNeeded'
}

export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    NOT_SCHEDULED = 'notScheduled',
    WAITING_TO_SCHEDULE = 'waitingToSchedule'
}

export enum NoteImportance {
    NORMAL = 'normal',
    HIGHLIGHTED = 'highlighted'
}

export enum PaymentMethod {
    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    BANK_TRANSFER = 'bank_transfer',
    INSURANCE = 'insurance',
    BARTER = 'barter'
}

export interface ITreatment extends Document {
    id: string;
    userId: Schema.Types.ObjectId;
    patientId: Schema.Types.ObjectId;
    date: Date;
    status: SessionStatus;
    patientNotes: {
        text: string;
        importance: NoteImportance;
        createdAt: Date;
    }[];
    treatmentNotes: {
        text: string;
        importance: NoteImportance;
        createdAt: Date;
    }[];
    interventions: {
        method: string;
        description: string;
    }[];
    homework: {
        task: string;
        assignedTo: HomeworkTarget;
        status: HomeworkStatus;
        notes: string;
    }[];
    attachments: {
        fileName: string;
        url: string;
        uploadedBy: 'therapist' | 'patient';
        dateUploaded: Date;
        description: string;
        relatedTo: string;
    }[];
    administration: {
        price: number;
        payment: {
            status: PaymentStatus;
            method: PaymentMethod;
            notes: string;
        };
        receipt: {
            status: ReceiptStatus;
            reason: string;
        };
        nextAppointment: {
            status: AppointmentStatus;
            date: Date;
            notes: string;
            reminderTo: 'therapist' | 'patient' | 'both';
        };
    };
    createdAt: Date;
    updatedAt: Date;
}

const treatmentSchema = new Schema<ITreatment>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Therapist ID is required'],
            index: true
        },
        patientId: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: [true, 'Patient ID is required'],
            index: true
        },
        date: {
            type: Date,
            required: [true, 'Treatment date is required']
        },
        status: {
            type: String,
            enum: Object.values(SessionStatus),
            default: SessionStatus.PLANNED
        },
        patientNotes: [{
            text: {
                type: String,
                required: true
            },
            importance: {
                type: String,
                enum: Object.values(NoteImportance),
                default: NoteImportance.NORMAL
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        treatmentNotes: [{
            text: {
                type: String,
                required: true
            },
            importance: {
                type: String,
                enum: Object.values(NoteImportance),
                default: NoteImportance.NORMAL
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        interventions: [{
            method: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }],
        homework: [{
            task: {
                type: String,
                required: true
            },
            assignedTo: {
                type: String,
                enum: Object.values(HomeworkTarget),
                required: true
            },
            status: {
                type: String,
                enum: Object.values(HomeworkStatus),
                default: HomeworkStatus.IN_PROGRESS
            },
            notes: String
        }],
        attachments: [{
            fileName: String,
            url: String,
            uploadedBy: {
                type: String,
                enum: ['therapist', 'patient']
            },
            dateUploaded: {
                type: Date,
                default: Date.now
            },
            description: String,
            relatedTo: String
        }],
        administration: {
            price: Number,
            payment: {
                status: {
                    type: String,
                    enum: Object.values(PaymentStatus),
                    default: PaymentStatus.UNPAID
                },
                method: {
                    type: String,
                    enum: Object.values(PaymentMethod)
                },
                notes: String
            },
            receipt: {
                status: {
                    type: String,
                    enum: Object.values(ReceiptStatus),
                    default: ReceiptStatus.NOT_NEEDED
                },
                reason: String
            },
            nextAppointment: {
                status: {
                    type: String,
                    enum: Object.values(AppointmentStatus),
                    default: AppointmentStatus.NOT_SCHEDULED
                },
                date: Date,
                notes: String,
                reminderTo: {
                    type: String,
                    enum: ['therapist', 'patient', 'both']
                }
            }
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        },
        toObject: {
            transform: (_, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
);

// Query optimization for common access patterns
treatmentSchema.index({ userId: 1, patientId: 1 });
treatmentSchema.index({ userId: 1, date: -1 });

// Multi-tenant security: prevent cross-therapist data access
treatmentSchema.pre('save', async function(next) {
    if (this.isModified('patientId')) {
        const patient = await Patient.findOne({
            _id: this.patientId,
            userId: this.userId
        });
        if (!patient) {
            throw new AppError(
                'Patient not found or does not belong to therapist',
                StatusCodes.BAD_REQUEST
            );
        }
    }
    next();
});

export const Treatment = model<ITreatment>('Treatment', treatmentSchema);