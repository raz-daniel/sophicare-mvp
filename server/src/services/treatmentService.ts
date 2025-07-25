import { SessionStatus, Treatment } from "../models/Treatment";
import { Patient } from "../models/Patient";
import { AppError } from "../errors/AppError";
import { StatusCodes } from "http-status-codes";

export const treatmentService = {
    
    createTreatment: async (treatmentData: any, userId: string, patientId: string) => {
        const patient = await Patient.findOne({ _id: patientId, userId });
        if (!patient) throw new AppError('Patient not found', StatusCodes.NOT_FOUND);

        const treatment = await Treatment.create({
            ...treatmentData,
            userId,
            patientId
        });

        await Patient.findByIdAndUpdate(patientId, {
            lastTreatmentDate: new Date(),
            $inc: { treatmentCount: 1 }
        });

        return treatment;
    },

    getTreatmentsByPatient: async (userId: string, patientId: string, page: number, limit: number) => {
        const patient = await Patient.findOne({ _id: patientId, userId });
        if (!patient) throw new AppError('Patient not found', StatusCodes.NOT_FOUND);
       
        const treatments = await Treatment.find({ patientId, userId })
            .sort({ date: -1, createdAt: -1 })
            .limit(limit)
            .skip((page -1) * limit);

        const totalCount = await Treatment.countDocuments({ patientId, userId });

        return {
            treatments,
            totalCount
        }
    },

    getTreatmentById: async (userId: string, Id: string) => {
        const treatment = await Treatment.findOne({ _id: Id, userId });
        if (!treatment) throw new AppError('Treatment not found', StatusCodes.NOT_FOUND);

        return treatment;
    },

    updateTreatment: async (userId: string, id: string, updateData: any) => {
        if (updateData.patientId || updateData.userId) throw new AppError('Cannot change treatment ownership or patient', StatusCodes.BAD_REQUEST);
        const treatment = await Treatment.findOneAndUpdate({ _id: id, userId },
            updateData,
            {
                new: true,
                runValidators: true
            }
        )
        if (!treatment) throw new AppError('Treatment not found', StatusCodes.NOT_FOUND);

        return treatment;
    },

    deleteTreatment: async (userId: string, id: string) => {
        const treatment = await Treatment.findOneAndUpdate(
            { _id: id, userId },
            { status: SessionStatus.CANCELLED }
        );
        if (!treatment) throw new AppError('Treatment not found', StatusCodes.NOT_FOUND);

        return { message: 'Treatment successfully cancelled' };
    }


}