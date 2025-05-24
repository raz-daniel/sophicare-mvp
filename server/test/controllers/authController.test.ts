import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { User, UserRole } from '../../src/models/User';
import { AppError } from '../../src/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import {
  registerController,
  loginController,
  getCurrentUserController,
  logoutController
} from '../../src/controllers/authController';

interface MockResponse {
  json: jest.Mock;
  status: jest.Mock;
}

interface AuthResponse {
  user: {
    id: string;
    [key: string]: any;
  };
  accessToken: string;
  refreshToken: string;
}

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: MockResponse;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    nextFunction = jest.fn();
  });

  describe('registerController', () => {
    it('should register a new user', async () => {
      mockRequest.body = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test-controller1@example.com',
        password: 'StrongP@ss123'
      };

      await registerController(mockRequest as Request, mockResponse as unknown as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(mockResponse.json).toHaveBeenCalled();
      const response = mockResponse.json.mock.calls[0][0] as AuthResponse;
      expect(response.user).toBeDefined();
      expect(response.accessToken).toBeDefined();
      expect(response.refreshToken).toBeDefined();
    });

    it('should handle duplicate email', async () => {
      await User.create({
        firstName: 'Existing',
        lastName: 'User',
        email: 'test-controller2@example.com',
        password: 'StrongP@ss123'
      });

      mockRequest.body = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test-controller2@example.com',
        password: 'StrongP@ss123'
      };

      await registerController(mockRequest as Request, mockResponse as unknown as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      const error = nextFunction.mock.calls[0][0] as AppError;
      expect(error.statusCode).toBe(StatusCodes.CONFLICT);
    });
  });

  describe('loginController', () => {
    beforeEach(async () => {
      await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test-controller3@example.com',
        password: 'StrongP@ss123',
        role: UserRole.THERAPIST
      });
    });

    it('should login with valid credentials', async () => {
      mockRequest.body = {
        email: 'test-controller3@example.com',
        password: 'StrongP@ss123'
      };

      await loginController(mockRequest as Request, mockResponse as unknown as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalled();
      const response = mockResponse.json.mock.calls[0][0] as AuthResponse;
      expect(response.user).toBeDefined();
      expect(response.accessToken).toBeDefined();
      expect(response.refreshToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      mockRequest.body = {
        email: 'test-controller4@example.com',
        password: 'wrongpassword'
      };

      await loginController(mockRequest as Request, mockResponse as unknown as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      const error = nextFunction.mock.calls[0][0] as AppError;
      expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('getCurrentUserController', () => {
    it('should return current user', async () => {
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test-controlle5@example.com',
        password: 'StrongP@ss123',
        role: UserRole.THERAPIST
      });

      mockRequest.user = {
        userId: user.id,
        role: user.role
      };

      await getCurrentUserController(mockRequest as Request, mockResponse as unknown as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalled();
      const response = mockResponse.json.mock.calls[0][0] as { user: { id: string } };
      expect(response.user).toBeDefined();
      expect(response.user.id).toBeTruthy();
      expect(response.user.id).toBeDefined();

    });

    it('should handle unauthenticated request', async () => {
      mockRequest.user = undefined;

      await getCurrentUserController(mockRequest as Request, mockResponse as unknown as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(AppError));
      const error = nextFunction.mock.calls[0][0] as AppError;
      expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('logoutController', () => {
    it('should handle logout', async () => {
      await logoutController(mockRequest as Request, mockResponse as unknown as Response, nextFunction);

      expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Logged out successfully',
        success: true
      });
    });
  });
}); 