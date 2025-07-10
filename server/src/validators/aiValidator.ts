import { z } from 'zod';

export const generateInsightSchema = z.object({
    body: z.object({
        sessionSummary: z.string()
            .min(10, 'Session summary must be at least 10 characters long')
            .max(5000, 'Session summary is too long')
    })
});