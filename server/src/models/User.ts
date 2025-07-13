import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
    THERAPIST = 'therapist',
    PATIENT = 'patient',
    ADMIN = 'admin'
}

export enum AccountStatus {
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    INACTIVE = 'inactive'
}

export enum EmailStatus {
    VERIFIED = 'verified',
    PENDING = 'pending',
    EXPIRED = 'expired',
    FAILED = 'failed'
}

export interface IUser extends Document {
    id: string
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole[];
    emailStatus: EmailStatus;
    accountStatus: AccountStatus;
    googleId?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    getFullName(): string;
}

const userSchema = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters'],
            minlength: [2, 'First name must be at least 2 characters long']
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters'],
            minlength: [2, 'Last name must be at least 2 characters long']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: function (this: IUser) {
                return !this.googleId;
            },
            minlength: [8, 'Password must be at least 8 characters long'],
            select: false
        },
        role: {
            type: [String],
            enum: Object.values(UserRole),
            default: [UserRole.THERAPIST],
            validate: {
                validator: function(roles: UserRole[]) {
                    return roles.length > 0; 
                },
                message: 'User must have at least one role'
            }
        },
        emailStatus: {
            type: String,
            enum: Object.values(EmailStatus),
            default: EmailStatus.PENDING
        },
        accountStatus: {
            type: String,
            enum: Object.values(AccountStatus),
            default: AccountStatus.ACTIVE
        },
        googleId: {
            type: String,
            sparse: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (_doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                return ret;
            }
        },
        toObject: {
            transform: function (_doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                return ret;
            }
        }
    }
);

userSchema.index({ email: 1, googleId: 1 }, { unique: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    if (!this.password) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

userSchema.methods.getFullName = function (): string {
    return `${this.firstName} ${this.lastName}`.trim();
};

userSchema.statics.findByEmail = function (email: string) {
    return this.findOne({ email: email.toLowerCase() });
};

export const User = mongoose.model<IUser>('User', userSchema); 