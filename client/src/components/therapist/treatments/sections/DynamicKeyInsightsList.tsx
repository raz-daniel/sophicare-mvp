import { Plus, Trash2 } from 'lucide-react';
import { InsightCategory, InsightSource, type KeyInsight } from '../../../../types/treatment';

interface DynamicKeyInsightsListProps {
  insights: KeyInsight[];
  onChange: (insights: KeyInsight[]) => void;
}

export const DynamicKeyInsightsList = ({
  insights,
  onChange
}: DynamicKeyInsightsListProps) => {
  const addInsight = () => {
    const newInsight: KeyInsight = {
      text: '',
      category: InsightCategory.PROGRESS,
      relatedTo: InsightSource.PATIENT
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

  const getCategoryColor = (category: InsightCategory) => {
    switch (category) {
      case InsightCategory.BREAKTHROUGH:
        return 'border-green-300 bg-green-50';
      case InsightCategory.CONCERN:
        return 'border-red-300 bg-red-50';
      case InsightCategory.PATTERN:
        return 'border-blue-300 bg-blue-50';
      case InsightCategory.GOAL:
        return 'border-purple-300 bg-purple-50';
      case InsightCategory.PROGRESS:
        return 'border-yellow-300 bg-yellow-50';
      default:
        return '';
    }
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
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
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
                      {source.charAt(0).toUpperCase() + source.slice(1)}
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