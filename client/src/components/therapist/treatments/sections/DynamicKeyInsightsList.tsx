import { Plus, Trash2 } from 'lucide-react';
import { InsightCategory, InsightSource, type KeyInsight } from '../../../../types/treatment';
import { capitalize, formatEnumValue } from '../../../../utils/stringUtils';

interface DynamicKeyInsightsListProps {
  insights: KeyInsight[];
  onChange: (insights: KeyInsight[]) => void;
}

export const DynamicKeyInsightsList = ({
  insights,
  onChange
}: DynamicKeyInsightsListProps) => {

  // Object mapping instead of switch case - Uncle Bob approved!
  const getCategoryColor = (category: InsightCategory): string => {
    const categoryColors = {
      [InsightCategory.BREAKTHROUGH]: 'border-green-300 bg-green-50',
      [InsightCategory.CONCERN]: 'border-red-300 bg-red-50',
      [InsightCategory.PATTERN]: 'border-blue-300 bg-blue-50',
      [InsightCategory.GOAL]: 'border-purple-300 bg-purple-50',
      [InsightCategory.PROGRESS]: 'border-yellow-300 bg-yellow-50'
    } as const;
    
    return categoryColors[category] || '';
  };

  const addInsight = () => {
    const newInsight: KeyInsight = {
      text: '',
      category: InsightCategory.PROGRESS,
      relatedTo: InsightSource.PATIENT,
      createdAt: new Date().toISOString()
    };
    onChange([...insights, newInsight]);
  };

  const removeInsight = (index: number) => {
    const updatedInsights = insights.filter((_, i) => i !== index);
    onChange(updatedInsights);
  };

  const updateInsight = (index: number, field: keyof KeyInsight, value: any) => {
    const updatedInsights = insights.map((insight, i) => 
      i === index ? { ...insight, [field]: value } : insight
    );
    onChange(updatedInsights);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Key Insights</h3>
          <p className="text-sm text-gray-600">
            Extract the most important points from this session for long-term tracking
          </p>
        </div>
        <button
          type="button"
          onClick={addInsight}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} />
          Add Insight
        </button>
      </div>

      {insights.length === 0 ? (
        <div className="text-gray-500 text-sm italic">
          No key insights added yet. Extract important points from your session notes.
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${getCategoryColor(insight.category)}`}>
              <div className="flex gap-3 mb-3">
                {/* Category */}
                <select
                  value={insight.category}
                  onChange={(e) => updateInsight(index, 'category', e.target.value as InsightCategory)}
                  className="input-field text-sm"
                >
                  {Object.values(InsightCategory).map(category => (
                    <option key={category} value={category}>
                      {formatEnumValue(category)}
                    </option>
                  ))}
                </select>

                {/* Source */}
                <select
                  value={insight.relatedTo}
                  onChange={(e) => updateInsight(index, 'relatedTo', e.target.value as InsightSource)}
                  className="input-field text-sm"
                >
                  {Object.values(InsightSource).map(source => (
                    <option key={source} value={source}>
                      {capitalize(source)}
                    </option>
                  ))}
                </select>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeInsight(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                  title="Remove insight"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Insight Text */}
              <textarea
                value={insight.text}
                onChange={(e) => updateInsight(index, 'text', e.target.value)}
                placeholder="Describe the key insight..."
                className="w-full input-field resize-none"
                rows={2}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};