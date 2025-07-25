import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const HIGH_MEMORY_THRESHOLD = 100;

const getMemoryStats = () => {
    const memory = process.memoryUsage();
    const used = Math.round(memory.heapUsed / 1024 / 1024);
    return {
        used,
        total: Math.round(memory.heapTotal / 1024 / 1024),
        rss: Math.round(memory.rss / 1024 / 1024),
        memoryAlert: used > HIGH_MEMORY_THRESHOLD ? '🚨 High memory usage!' : '✅ Normal'
    }
}
export const memoryStatus = (req: Request, res: Response) => {
    const memoryStats = getMemoryStats();
    const trend = req.query.trend ? 'stable' : 'unknown'; // later i will implement real trend analysis...

    res.status(StatusCodes.OK).json({
        ...memoryStats,
        trend,
        timestamp: new Date().toISOString()
    })
}

export const memoryLeakTest = async (_req: Request, res: Response) => {
    const results = [];

    for (let i = 0; i < 100; i++) {
        try {
            const fakeUserId = "507f1f77bcf86cd799439011";
            const fakePatientId = "507f1f77bcf86cd799439012"

            const fakeTreatments = Array(50).fill(null).map((_, index) => ({
                id: `treatment_${i}_${index}`,
                patientId: fakePatientId,
                userId: fakeUserId,
                date: new Date(),
                patientNotes: Array(10).fill({ text: "Long note ".repeat(20) }),
                treatmentNotes: Array(10).fill({ text: "Treatment note ".repeat(20) }),
                homework: Array(5).fill({ task: "Homework task ".repeat(10) })
            }))

            results.push(fakeTreatments);
        } catch (error) {
            //continue
        }
    }

    res.status(StatusCodes.OK).json({
        message: `Created ${results.length} fake treatment sets`,
        memoryAfter: process.memoryUsage()
    })
}


export const memoryHealthCheck = (_req: Request, res: Response) => {
    const memoryStats = getMemoryStats();

    if (memoryStats.used > HIGH_MEMORY_THRESHOLD) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'unhealthy', ...memoryStats })
    } else {
        res.status(StatusCodes.OK).json({ status: 'healthy', ...memoryStats})
    }
    
}
