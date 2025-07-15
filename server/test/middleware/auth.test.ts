import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { authenticate, authorize } from '../../src/middleware/auth';
import { UserRole } from '../../src/models/User';
import { generateAccessToken } from '../../src/utils/jwt';
import { AppError } from '../../src/errors/AppError';
import { User } from '../../src/models/User';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(() => mockResponse) as any,
      status: jest.fn(() => mockResponse) as any
    };
    nextFunction = jest.fn();
  });

  describe('authenticate', () => {
    it('should authenticate valid token', async () => {
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test-middleware1@example.com',
        password: 'StrongP@ss123',
        role: UserRole.THERAPIST
      });

      const token = generateAccessToken(user);
      mockRequest.headers = {
        authorization: `Bearer ${token}`
      };

      await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith();
      expect(mockRequest.user).toBeDefined();
      expect(mockRequest.user?.userId).toBe(user.id);
    });

    it('should reject request without token', async () => {
      mockRequest.headers = {};

      await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      const error = nextFunction.mock.calls[0][0] as AppError;
      expect(error.statusCode).toBe(401);
    });

    it('should reject request with invalid token', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token'
      };

      await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      const error = nextFunction.mock.calls[0][0] as AppError;
      expect(error.statusCode).toBe(401);
    });
  });

  describe('authorize', () => {
    it('should authorize user with correct role', async () => {
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test-middleware2@example.com',
        password: 'StrongP@ss123',
        role: UserRole.THERAPIST
      });

      mockRequest.user = {
        userId: user.id,
        role: user.role
      };

      const authorizeMiddleware = authorize(UserRole.THERAPIST);
      await authorizeMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith();
    });

    it('should reject user with incorrect role', async () => {
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test-middleware3@example.com',
        password: 'StrongP@ss123',
        role: UserRole.PATIENT
      });

      const token = generateAccessToken(user);
      mockRequest.headers = {
        authorization: `Bearer ${token}`
      };

      await authenticate(mockRequest as Request, mockResponse as Response, nextFunction);
      nextFunction.mockClear();

      const authorizeMiddleware = authorize(UserRole.THERAPIST);
      await authorizeMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      const error = nextFunction.mock.calls[0][0] as AppError;
      expect(error.statusCode).toBe(403);
    });
  });
}); 