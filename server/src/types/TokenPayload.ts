import { UserRole } from '../models/User';

export interface TokenPayload {
    userId: string;
    roles: UserRole[];
    iat?: number;
    exp?: number;
}