import { UserRole } from '../models/User';

export interface TokenPayload {
    userId: string;
    role: UserRole;
} 