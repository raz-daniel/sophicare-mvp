import { describe, it, expect, jest } from '@jest/globals';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../src/utils/jwt';
import { UserRole, IUser } from '../../src/models/User';
import { AppError } from '../../src/errors/AppError';

describe('JWT Utils', () => {
    const mockUser = {
        id: '123',
        role: UserRole.THERAPIST
    } as IUser;

    describe('generateAccessToken', () => {
        it('should generate a valid access token', () => {
            const token = generateAccessToken(mockUser);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decoded = verifyToken(token);
            expect(decoded.userId).toBe(mockUser.id);
            expect(decoded.role).toBe(mockUser.role);
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            const token = generateRefreshToken(mockUser);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');

            const decoded = verifyToken(token);
            expect(decoded.userId).toBe(mockUser.id);
            expect(decoded.role).toBe(mockUser.role);
        });
    });

    describe('verifyToken', () => {
        it('should verify a valid token', () => {
            const token = generateAccessToken(mockUser);
            const decoded = verifyToken(token);
            expect(decoded.userId).toBe(mockUser.id);
            expect(decoded.role).toBe(mockUser.role);
        });

        it('should throw error for invalid token', () => {
            expect(() => verifyToken('invalid-token')).toThrow(AppError);
        });

        it('should throw error for expired token', () => {
            jest.useFakeTimers();
            const token = generateAccessToken(mockUser);
            jest.advanceTimersByTime(16 * 60 * 1000);
            expect(() => verifyToken(token)).toThrow(AppError);
            jest.useRealTimers();
          });

          it('should throw specific error for expired token', () => {
            expect(() => verifyToken('invalid')).toThrow('Invalid token');
          });
          
          it('should handle malformed token', () => {
            expect(() => verifyToken('not.a.jwt')).toThrow(AppError);
          });

    });
}); 