import httpClient from '../auth/httpClient';

interface InsightRequest {
    sessionSummary: string;
}

interface InsightResponse {
    meaningfulMoment: string
    whyItMatters: string
    nextSessionSuggestion: string
    guidingQuestion: string
}

export const openaiService = {
    generateInsight: async (data: InsightRequest): Promise <InsightResponse> => {
        const response = await httpClient.post('/ai/insights', data);
        return response.data
    }
}