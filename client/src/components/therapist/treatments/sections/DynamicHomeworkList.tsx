import { Plus, Trash2 } from 'lucide-react';
import { HomeworkTarget, HomeworkStatus, type Homework } from '../../../../types/treatment';
import { capitalize, formatEnumValue } from '../../../../utils/stringUtils';

interface DynamicHomeworkListProps {
  homework: Homework[];
  onChange: (homework: Homework[]) => void;
}

export const DynamicHomeworkList = ({
  homework,
  onChange
}: DynamicHomeworkListProps) => {
  
  // Object mapping instead of switch case - Uncle Bob approved!
  const getTargetColor = (target: HomeworkTarget): string => {
    const targetColors = {
      [HomeworkTarget.PATIENT]: 'border-blue-300 bg-blue-50',
      [HomeworkTarget.THERAPIST]: 'border-green-300 bg-green-50',
      [HomeworkTarget.BOTH]: 'border-purple-300 bg-purple-50'
    } as const;
    
    return targetColors[target] || '';
  };

  const addHomework = () => {
    const newHomework: Homework = {
      text: '',
      task: '',
      assignedTo: HomeworkTarget.PATIENT,
      status: HomeworkStatus.DRAFT,
      notes: '',
      createdAt: new Date().toISOString() // Add timestamp automatically
    };
    onChange([...homework, newHomework]);
  };

  const removeHomework = (index: number) => {
    const updatedHomework = homework.filter((_, i) => i !== index);
    onChange(updatedHomework);
  };

  const updateHomework = (index: number, field: keyof Homework, value: any) => {
    const updatedHomework = homework.map((hw, i) => 
      i === index ? { ...hw, [field]: value } : hw
    );
    onChange(updatedHomework);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Homework Assignments</h3>
        <button
          type="button"
          onClick={addHomework}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <Plus size={16} />
          Add Homework
        </button>
      </div>

      {homework.length === 0 ? (
        <div className="text-gray-500 text-sm italic">
          No homework assigned yet. Add tasks for patient practice or therapist follow-up.
        </div>
      ) : (
        <div className="space-y-4">
          {homework.map((hw, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${getTargetColor(hw.assignedTo)}`}>
              <div className="flex gap-3 mb-3">
                {/* Assigned To */}
                <select
                  value={hw.assignedTo}
                  onChange={(e) => updateHomework(index, 'assignedTo', e.target.value as HomeworkTarget)}
                  className="input-field text-sm"
                >
                  {Object.values(HomeworkTarget).map(target => (
                    <option key={target} value={target}>
                      {capitalize(target)}
                    </option>
                  ))}
                </select>

                {/* Status */}
                <select
                  value={hw.status}
                  onChange={(e) => updateHomework(index, 'status', e.target.value as HomeworkStatus)}
                  className="input-field text-sm"
                >
                  {Object.values(HomeworkStatus).map(status => (
                    <option key={status} value={status}>
                      {formatEnumValue(status)}
                    </option>
                  ))}
                </select>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeHomework(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                  title="Remove homework"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Task */}
              <textarea
                value={hw.task}
                onChange={(e) => updateHomework(index, 'task', e.target.value)}
                placeholder="Describe the homework task..."
                className="w-full input-field resize-none mb-3"
                rows={2}
              />

              {/* Notes */}
              <textarea
                value={hw.notes || ''}
                onChange={(e) => updateHomework(index, 'notes', e.target.value)}
                placeholder="Additional notes or instructions..."
                className="w-full input-field resize-none"
                rows={1}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};