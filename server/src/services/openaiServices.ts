import OpenAI from 'openai';
import config from '../config/config';

const openai = new OpenAI({
    apiKey: config.openai.apiKey,
})

interface InsightRequest {
    sessionSummary: string;
}

interface InsightResponse {
    meaningfulMoment: string;
    whyItMatters: string;
    nextSessionSuggestion: string;
    guidingQuestion: string;
}

export const openaiService = {
    generateInsight: async (data: InsightRequest): Promise<InsightResponse> => {

        const prompt = `You are a therapeutic assistant. Analyze this therapy session summary and provide insights:
        
        Session Summary: "${data.sessionSummary}"
        
        Please provide:
        1. A meaningful moment or detail that shouldn't be forgotten
        2. Why this moment matters therapeutically
        3. A suggestion for the next session
        4. A guiding for the therapist
        
        Format as JSON with keys: meaningfulMoment, whyItMatters, nextSessionSuggestion, guidingQuestion`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        })

        const aiResponse = JSON.parse(response.choices[0].message.content || '{}');

        return {
            meaningfulMoment: aiResponse.meaningfulMoment || "No meaningful moment detected",
            whyItMatters: aiResponse.whyItMatters || "Analysis pending",
            nextSessionSuggestion: aiResponse.nextSessionSuggestion || "Continue current approach",
            guidingQuestion: aiResponse.guidingQuestion || "How did that feel?"
        }
    }
}