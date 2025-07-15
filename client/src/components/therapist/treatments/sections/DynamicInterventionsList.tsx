// components/therapist/treatments/sections/DynamicInterventionsList.tsx        
import { Plus, Trash2 } from 'lucide-react';
import { type Intervention } from '../../../../types/treatment';

interface DynamicInterventionsListProps {
  interventions: Intervention[];
  onChange: (interventions: Intervention[]) => void;
}

export const DynamicInterventionsList = ({
  interventions,
  onChange
}: DynamicInterventionsListProps) => {
  const addIntervention = () => {
    const newIntervention: Intervention = {
      method: '',
      description: '',
      createdAt: new Date().toISOString()
    };
    onChange([...interventions, newIntervention]);
  };

  const removeIntervention = (index: number) => {
    const updatedInterventions = interventions.filter((_, i) => i !== index);
    onChange(updatedInterventions);
  };

  const updateIntervention = (index: number, field: keyof Intervention, value: string) => {
    const updatedInterventions = interventions.map((intervention, i) => 
      i === index ? { ...intervention, [field]: value } : intervention
    );
    onChange(updatedInterventions);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Interventions</h3>
        <button
          type="button"
          onClick={addIntervention}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} />
          Add Intervention
        </button>
      </div>

      {interventions.length === 0 ? (
        <div className="text-gray-500 text-sm italic">
          No interventions added yet. Document the therapeutic techniques used.
        </div>
      ) : (
        <div className="space-y-4">
          {interventions.map((intervention, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex gap-3 mb-3">
                {/* Method */}
                <input
                  type="text"
                  value={intervention.method}
                  onChange={(e) => updateIntervention(index, 'method', e.target.value)}
                  placeholder="Intervention method (e.g., CBT, Exposure, Mindfulness)"
                  className="flex-1 input-field"
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeIntervention(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                  title="Remove intervention"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Description */}
              <textarea
                value={intervention.description}
                onChange={(e) => updateIntervention(index, 'description', e.target.value)}
                placeholder="Describe the intervention and its outcome..."
                className="w-full input-field resize-none"
                rows={3}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};