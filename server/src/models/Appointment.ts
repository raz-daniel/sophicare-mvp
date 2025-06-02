// models/Appointment.ts
import mongoose, { Document, Schema } from 'mongoose';

export enum SessionType {
    INTAKE = 'intake',
    THERAPY = 'therapy',
    FOLLOW_UP = 'follow_up',
    ASSESSMENT = 'assessment',
    GROUP = 'group'
}

export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
    RESCHEDULED = 'rescheduled'
}

const generateTitle = (sessionType: SessionType, patientName: string): string => {
    const typeMap = {
      'intake': 'Intake Session',
      'therapy': 'Therapy Session', 
      'follow_up': 'Follow-up',
      'assessment': 'Assessment',
      'group': 'Group Session'
    };
    return `${typeMap[sessionType]} - ${patientName}`;
  };

export interface IAppointment extends Document {
    id: string;
    therapistId: mongoose.Types.ObjectId;
    patientId: mongoose.Types.ObjectId;
    title: string;
    date: Date;
    startTime: string; // "10:00"
    endTime: string;   // "11:00"
    duration: number;  // in minutes
    sessionType: SessionType;
    status: AppointmentStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>({
    therapistId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Therapist reference is required']
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Patient reference is required']
    },
    title: {
        type: String,
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    date: {
        type: Date,
        required: [true, 'Appointment date is required']
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [15, 'Minimum appointment duration is 15 minutes'],
        max: [480, 'Maximum appointment duration is 8 hours']
    },
    sessionType: {
        type: String,
        enum: Object.values(SessionType),
        required: [true, 'Session type is required']
    },
    status: {
        type: String,
        enum: Object.values(AppointmentStatus),
        default: AppointmentStatus.SCHEDULED
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (_doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Indexes
appointmentSchema.index({ therapistId: 1, date: 1 });
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ therapistId: 1, status: 1 });

appointmentSchema.pre('save', async function (next) {
    try {
        // Only generate title if not provided
        if (!this.title) {
            // Get patient name
            const patient = await mongoose.connection.collection('patients').findOne({
                _id: new mongoose.Types.ObjectId(this.patientId)
            });
            
            if (patient) {
                const patientName = `${patient.firstName} ${patient.lastName}`;
                this.title = generateTitle(this.sessionType, patientName);
            }
        }
        next();
    } catch (error) {
        next(error as Error);
    }
});

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);