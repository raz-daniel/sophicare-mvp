import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { Treatment, SessionStatus, NoteImportance, HomeworkStatus, HomeworkTarget } from '../../src/models/Treatment';
import { Patient } from '../../src/models/Patient';
import { User, UserRole } from '../../src/models/User';
import { AppError } from '../../src/errors/AppError';
import { StatusCodes } from 'http-status-codes';
import {
    createTreatment,
    getTreatmentsByPatient,
    getTreatmentById,
    updateTreatment,
    deleteTreatment,
    getHighlightedNotes,
    getActiveHomework,
    updateHomeworkStatus
} from '../../src/controllers/treatmentController';
import { TokenPayload } from '../../src/types/TokenPayload';

interface MockResponse {
    json: jest.Mock;
    status: jest.Mock;
}

describe('Treatment Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: MockResponse;
    let nextFunction: jest.Mock;
    let testTherapist: any;
    let otherTherapist: any;
    let testPatient: any;
    let testTreatment: any;

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

        // Create test treatment
        testTreatment = await Treatment.create({
            userId: testTherapist._id,
            patientId: testPatient._id,
            date: new Date(),
            status: SessionStatus.COMPLETED,
            patientNotes: [{
                text: 'Patient feeling better',
                importance: NoteImportance.HIGHLIGHTED,
                createdAt: new Date()
            }],
            treatmentNotes: [{
                text: 'Treatment successful',
                importance: NoteImportance.HIGHLIGHTED,
                createdAt: new Date()
            }],
            homework: [{
                task: 'Practice breathing exercises',
                assignedTo: HomeworkTarget.PATIENT,
                status: HomeworkStatus.IN_PROGRESS,
                notes: 'Daily practice'
            }],
            interventions: [{
                method: 'CBT',
                description: 'Cognitive restructuring'
            }]
        });

        // Setup request/response mocks
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        nextFunction = jest.fn();
    });

    describe('createTreatment', () => {
        it('should create a new treatment successfully', async () => {
            const treatmentData = {
                date: new Date(),
                status: SessionStatus.PLANNED,
                patientNotes: [{
                    text: 'New patient note',
                    importance: NoteImportance.NORMAL
                }],
                homework: [{
                    task: 'New homework',
                    assignedTo: HomeworkTarget.PATIENT,
                    status: HomeworkStatus.IN_PROGRESS
                }]
            };

            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testPatient._id },
                body: treatmentData
            };

            await createTreatment(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.CREATED);
            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.patientId.toString()).toBe(testPatient._id.toString());
            expect(response.userId.toString()).toBe(testTherapist._id.toString());
            expect(response.patientNotes).toHaveLength(1);
            expect(response.homework).toHaveLength(1);
        });

        it('should handle patient not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' },
                body: { date: new Date() }
            };

            await createTreatment(
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
                params: { id: testPatient._id },
                body: { date: new Date() }
            };

            await createTreatment(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });
    });

    describe('getTreatmentsByPatient', () => {
        it('should get all treatments for patient successfully', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testPatient._id }
            };

            await getTreatmentsByPatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.treatments).toHaveLength(1);
            expect(response.count).toBe(1);
            expect(response.treatments[0].patientId.toString()).toBe(testPatient._id.toString());
        });

        it('should handle patient not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' }
            };

            await getTreatmentsByPatient(
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

            await getTreatmentsByPatient(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });
    });

    describe('getTreatmentById', () => {
        it('should get treatment by id successfully', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testTreatment._id }
            };

            await getTreatmentById(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.patientId.toString()).toBe(testPatient._id.toString());
            expect(response.userId.toString()).toBe(testTherapist._id.toString());
            expect(response.patientNotes).toHaveLength(1);
            expect(response.treatmentNotes).toHaveLength(1);
        });

        it('should handle treatment not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' }
            };

            await getTreatmentById(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        });

        it('should prevent access to other therapist\'s treatment', async () => {
            mockRequest = {
                user: { userId: otherTherapist._id } as TokenPayload,
                params: { id: testTreatment._id }
            };

            await getTreatmentById(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        });
    });

    describe('updateTreatment', () => {
        it('should update treatment successfully', async () => {
            const updateData = {
                status: SessionStatus.COMPLETED,
                patientNotes: [{
                    text: 'Updated patient note',
                    importance: NoteImportance.NORMAL
                }]
            };

            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testTreatment._id },
                body: updateData
            };

            await updateTreatment(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.status).toBe(SessionStatus.COMPLETED);
            expect(response.patientNotes).toHaveLength(1);
            expect(response.patientNotes[0].text).toBe('Updated patient note');
        });

        it('should prevent changing patientId and userId', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testTreatment._id },
                body: {
                    patientId: '507f1f77bcf86cd799439011',
                    userId: otherTherapist._id
                }
            };

            await updateTreatment(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
            expect(error.message).toContain('ownership');
        });

        it('should handle treatment not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' },
                body: { status: SessionStatus.COMPLETED }
            };

            await updateTreatment(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        });
    });

    describe('deleteTreatment', () => {
        it('should soft delete treatment successfully', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testTreatment._id }
            };

            await deleteTreatment(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.message).toContain('successfully');

            // Verify treatment is soft deleted
            const deletedTreatment = await Treatment.findById(testTreatment._id);
            expect(deletedTreatment?.status).toBe(SessionStatus.CANCELLED);
        });

        it('should handle treatment not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' }
            };

            await deleteTreatment(
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
                params: { id: testTreatment._id }
            };

            await deleteTreatment(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });
    });

    describe('getHighlightedNotes', () => {
        it('should get highlighted notes successfully', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testPatient._id }
            };

            await getHighlightedNotes(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.highlights).toHaveLength(2); // One patient note + one treatment note
            expect(response.count).toBe(2);
            expect(response.highlights[0].type).toBeDefined();
            expect(response.highlights[0].text).toBeDefined();
        });

        it('should handle patient not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' }
            };

            await getHighlightedNotes(
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

            await getHighlightedNotes(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });
    });

    describe('getActiveHomework', () => {
        it('should get active homework successfully', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testPatient._id }
            };

            await getActiveHomework(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.homework).toHaveLength(1);
            expect(response.count).toBe(1);
            expect(response.homework[0].status).toBe(HomeworkStatus.IN_PROGRESS);
        });

        it('should handle patient not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' }
            };

            await getActiveHomework(
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

            await getActiveHomework(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.UNAUTHORIZED);
        });
    });

    describe('updateHomeworkStatus', () => {
        it('should update homework status successfully', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testTreatment._id },
                body: {
                    homeworkIndex: 0,
                    status: HomeworkStatus.FINISHED,
                    notes: 'Completed successfully'
                }
            };

            await updateHomeworkStatus(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(mockResponse.json).toHaveBeenCalled();
            const response = mockResponse.json.mock.calls[0][0] as any;
            expect(response.message).toContain('successfully');
            expect(response.homework.status).toBe(HomeworkStatus.FINISHED);
            expect(response.homework.notes).toBe('Completed successfully');
        });

        it('should handle treatment not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: '507f1f77bcf86cd799439011' },
                body: {
                    homeworkIndex: 0,
                    status: HomeworkStatus.FINISHED
                }
            };

            await updateHomeworkStatus(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
        });

        it('should handle homework not found', async () => {
            mockRequest = {
                user: { userId: testTherapist._id } as TokenPayload,
                params: { id: testTreatment._id },
                body: {
                    homeworkIndex: 999,
                    status: HomeworkStatus.FINISHED
                }
            };

            await updateHomeworkStatus(
                mockRequest as Request,
                mockResponse as unknown as Response,
                nextFunction
            );

            expect(nextFunction).toHaveBeenCalled();
            const error = nextFunction.mock.calls[0][0] as AppError;
            expect(error.statusCode).toBe(StatusCodes.NOT_FOUND);
            expect(error.message).toContain('Homework item');
        });

        it('should handle unauthorized access', async () => {
            mockRequest = {
                params: { id: testTreatment._id },
                body: {
                    homeworkIndex: 0,
                    status: HomeworkStatus.FINISHED
                }
            };

            await updateHomeworkStatus(
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