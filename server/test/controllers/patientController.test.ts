import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { Patient } from '../../src/models/Patient';
import { User, UserRole } from '../../src/models/User';
import { AppError } from '../../src/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient
} from '../../src/controllers/patientController';
import { TokenPayload } from '../../src/types/TokenPayload';

interface MockResponse {
    json: jest.Mock;
    status: jest.Mock;
}

describe('Patient Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: MockResponse;
    let nextFunction: jest.Mock;
    let testTherapist: any;
    let otherTherapist: any;
    let testPatient: any;

    beforeEach(async () => {
        // Clear all mocks
        jest.clearAllMocks();

        // Create test therapists
        testTherapist = await User.create({
            firstName: 'Test',
            lastName: 'Therapist',
            email: 'test@example.com',
            password: 'password123',
            role: UserRole.THERAPIST
        });

        otherTherapist = await User.create({
            firstName: 'Other',
            lastName: 'Therapist',
            email: 'other@example.com',
            password: 'password123',
            role: UserRole.THERAPIST
        });

        // Create test patient
        testPatient = await Patient.create({
            userId: testTherapist._id,
            fullName: 'Test Patient',
            email: 'patient@example.com',
            phone: '1234567890',
            birthDate: new Date('1990-01-01'),
            gender: 'male',
            address: '123 Test St',
            occupation: 'Developer',
            maritalStatus: 'single',
            children: 0,
            notes: 'Test notes',
            lastTreatmentDate: new Date(),
            treatmentCount: 0,
            isActive: true
        });

        // Setup request/response mocks
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        nextFunction = jest.fn();
    });

    describe('createPatient', () => {
        it('should create a new patient successfully', async () => {
            const patientData = {
                fullName: 'New Patient',
                email: 'new@example.com',
                phone: '9876543210',
                birthDate: new Date('1995-01-01'),
                gender: 'female',
                address: '456 New St',
                occupation: 'Designer',
                maritalStatus: 'married',
                children: 2,
                notes: 'New patient notes',
                isActive: true
            };

            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                body: patientData
            };

            await createPatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.fullName).toBe(patientData.fullName);
            expect(response.email).toBe(patientData.email);
            expect(response.userId.toString()).toBe(testTherapist._id.toString());
        });

        it('should handle duplicate email error', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                body: {
                    ...testPatient.toObject(),
                    _id: undefined
                }
            };

            await createPatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.CONFLICT);
            expect(error.message).toContain('email');
        });

        it('should handle unauthorized access', async () => {
            mockRequest = {
                body: {
                    fullName: 'New Patient',
                    email: 'new@example.com'
                }
            };

            await createPatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });
    });

    describe('getPatients', () => {
        it('should get all patients for therapist', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload
            };

            await getPatients(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.patients).toHaveLength(1);
            expect(response.count).toBe(1);
            expect(response.patients[0].fullName).toBe(testPatient.fullName);
        });

        it('should handle unauthorized access', async () => {
            mockRequest = {};

            await getPatients(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });

        it('should filter patients by status', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                query: { isActive: 'true' }
            };

            await getPatients(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.patients).toHaveLength(1);
            expect(response.patients[0].isActive).toBe(true);
        });
    });

    describe('getPatientById', () => {
        it('should get patient by id successfully', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testPatient._id }
            };

            await getPatientById(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.fullName).toBe(testPatient.fullName);
            expect(response.email).toBe(testPatient.email);
        });

        it('should handle patient not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' } // Random MongoDB ID
            };

            await getPatientById(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        });

        it('should prevent access to other therapist\'s patient', async () => {
            mockRequest = {
                user: { userId: otherTherapist._id } as TokenPayload,
                params: { id: testPatient._id }
            };

            await getPatientById(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        });
    });

    describe('updatePatient', () => {
        it('should update patient successfully', async () => {
            const updateData = {
                fullName: 'Updated Patient',
                notes: 'Updated notes'
            };

            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testPatient._id },
                body: updateData
            };

            await updatePatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.fullName).toBe(updateData.fullName);
            expect(response.notes).toBe(updateData.notes);
        });

        it('should prevent changing userId', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testPatient._id },
                body: { userId: otherTherapist._id }
            };

            await updatePatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(error.message).toContain('userId');
        });

        it('should handle patient not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' },
                body: { fullName: 'Updated Patient' }
            };

            await updatePatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        });
    });

    describe('deletePatient', () => {
        it('should soft delete patient successfully', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testPatient._id }
            };

            await deletePatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.message).toContain('successfully');

            // Verify patient is soft deleted
            const deletedPatient = await Patient.findById(testPatient._id) as any;
            expect(deletedPatient?.isActive).toBe(false);
        });

        it('should handle patient not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' }
            };

            await deletePatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        });

        it('should handle unauthorized access', async () => {
            mockRequest = {
                params: { id: testPatient._id }
            };

            await deletePatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });
    });
}); 