import { useState } from "react";
import { openaiService } from "../../../services/authAware/openaiService";

interface InsightData {
    meaningfulMoment: string;
    whyItMatters: string;
    nextSessionSuggestion: string;
    guidingQuestion: string;
}

type AnalysisState = 'idle' | 'analyzing' | 'success' | 'error';

export const DontForgetInsight = () => {
    const [sessionSummary, setSessionSummary] = useState<string>('');
    const [insight, setInsight] = useState<InsightData | null>(null);
    const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleAnalyze = async () => {
        if (!sessionSummary.trim()) return;

        setAnalysisState('analyzing');
        try {
            const result = await openaiService.generateInsight({ sessionSummary });
            setInsight(result);
            setAnalysisState('success');
        } catch (error: any) {
            console.error('Error Analyzing Session:', error)
            
            const backendMessage = error.response?.data?.message || 'Failed to analyze session. Please try again.'
            const cleanMessage = backendMessage.includes(':') ? backendMessage.split(':').pop()?.trim() : backendMessage;
            setErrorMessage(cleanMessage);
            
            setAnalysisState('error');
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Dont Forget Insights</h2>
                <p className="text-gray-600">
                    Paste your session summary and I'll help you remember what matters most
                </p>
            </div>

            <textarea
                value={sessionSummary}
                onChange={(e) => setSessionSummary(e.target.value)}
                placeholder="Paste your session summary here..."
                className="w-full h-40 p-4 border rounded-lg resize-none"
                rows={8}
            />

            <button className="mt-4 px-6 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200"
                style={{
                    background: '#e0e0e0',
                    boxShadow: '5px 5px 10px #bebebe, -5px -5px 10px #ffffff'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '5px 5px 10px #bebebe, -5px -5px 10px #ffffff'
                }}
                onClick={handleAnalyze}
                disabled={analysisState === 'analyzing'}
            >
                {analysisState === 'analyzing' ? 'Analyzing...' : 'Help Me Remember What Matters'}
            </button>
            {analysisState === 'success' && insight && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Key Insights Found</h3>
                    <div className="soace-y-4">
                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                            <h4 className="font-medium text-yellow-800">🟡 Meaningful Moment</h4>
                            <p className="text-yellow-700 mt-1">{insight.meaningfulMoment}</p>
                        </div>

                        <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                            <h4 className="font-medium text-green-800">🟢 Why it Matters</h4>
                            <p className="text-green-700 mt-1">{insight.whyItMatters}</p>
                        </div>

                        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <h4 className="font-medium text-blue-800">🔵 Next Session Suggestion</h4>
                            <p className="text-blue-700 mt-1">{insight.nextSessionSuggestion}</p>
                        </div>

                        <div className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded">
                            <h4 className="font-medium text-gray-800">🔸 Guiding Question</h4>
                            <p className="text-gray-700 mt-1">{insight.guidingQuestion}</p>
                        </div>
                    </div>
                </div>
            )}
            {analysisState === 'error' && (
                <div className="mt-4 p-4 bg-red-50 boreder border-red-200 rounded-lg">
                    <p className="text-red-600"> { errorMessage }</p>
                </div>
            )}
        </div>
    )
}