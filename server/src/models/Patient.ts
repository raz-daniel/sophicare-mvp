import mongoose, { Document, Schema } from 'mongoose';
import { AppError } from '../errors/AppError';
import { StatusCodes } from 'http-status-codes';

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum MaritalStatus {
    SINGLE = 'single',
    MARRIED = 'married',
    DIVORCED = 'divorced',
    WIDOWED = 'widowed',
    OTHER = 'other'
}

export enum PatientStatus {
    ACTIVE = 'active',              // Currently in treatment
    SCHEDULED = 'scheduled',        // Has future appointments  
    WAITING_LIST = 'waiting_list',  // Wants treatment, waiting for slot
    PAUSED = 'paused',             // Temporary break, will return
    COMPLETED = 'completed',        // Successfully finished treatment
    INACTIVE = 'inactive',          // No recent contact (1+ months)
    DISCHARGED = 'discharged'       // Formally ended/transferred
}

export interface IPatient extends Document {
    id: string;
    userId: mongoose.Types.ObjectId;  // The therapist this relationship is with
    firstName: string;                 // Only required personal information
    lastName: string;                 // Only required personal information
    email?: string;                   // Optional - for receipts when available
    phone?: string;
    birthDate?: Date;
    gender?: Gender;
    address?: string;
    occupation?: string;
    maritalStatus?: MaritalStatus;
    children?: string;
    notes?: string;
    lastTreatmentDate?: Date;
    treatmentCount: number;
    status: PatientStatus;
    createdAt: Date;
    updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Therapist reference is required']
        },
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters']
          },
          lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters']
          },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            validate: {
                validator: function(v: string) {
                    return !v || /^\S+@\S+\.\S+$/.test(v); // Only validate if value exists and not empty
                },
                message: 'Please enter a valid email'
            }
        },
        phone: {
            type: String,
            trim: true,
            validate: {
                validator: function(v: string) {
                    return !v || /^\+?[\d\s-]{10,}$/.test(v); // Only validate if value exists and not empty
                },
                message: 'Please enter a valid phone number'
            }
        },
        birthDate: {
            type: Date
        },
        gender: {
            type: String,
            enum: {
                values: Object.values(Gender),
                message: 'Please select a valid gender'
            }
        },
        address: {
            type: String,
            trim: true,
            maxlength: [200, 'Address cannot exceed 200 characters']
        },
        occupation: {
            type: String,
            trim: true,
            maxlength: [50, 'Occupation cannot exceed 50 characters']
        },
        maritalStatus: {
            type: String,
            enum: {
                values: Object.values(MaritalStatus),
                message: 'Please select a valid marital status'
            }
        },
        children: {
            type: String,
            trim: true,
            maxlength: [100, 'Children information cannot exceed 100 characters']
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [1000, 'Notes cannot exceed 1000 characters']
        },
        lastTreatmentDate: {
            type: Date
        },
        treatmentCount: {
            type: Number,
            default: 0,
            min: [0, 'Treatment count cannot be negative']
        },
        status: {
            type: String,
            enum: {
                values: Object.values(PatientStatus),
                message: 'Please select a valid status'
            },
            default: PatientStatus.WAITING_LIST
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (_doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        },
        toObject: {
            transform: function (_doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
);

// Performance indexes for common queries
patientSchema.index({ userId: 1 });                    // Find therapist's patients
patientSchema.index({ userId: 1, status: 1 });         // Filter by status
patientSchema.index({ userId: 1, firstName: 1, lastName: 1 });       // Search by name
patientSchema.index({ lastTreatmentDate: 1 });         // Treatment history queries

// Ensure userId references a valid User
patientSchema.pre('save', async function (next) {
    try {
        // Use direct collection query to avoid circular imports
        const userExists = await mongoose.connection.collection('users').findOne({ 
            _id: new mongoose.Types.ObjectId(this.userId) 
        });
        
        if (!userExists) {
            throw new AppError(
                'Referenced therapist does not exist',
                StatusCodes.BAD_REQUEST
            );
        }
        next();
    } catch (error) {
        next(error as Error);
    }
});

export const Patient = mongoose.model<IPatient>('Patient', patientSchema); 