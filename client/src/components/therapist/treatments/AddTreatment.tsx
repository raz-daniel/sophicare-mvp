import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DynamicNotesList } from './sections/DynamicNotesList';
import { DynamicKeyInsightsList } from './sections/DynamicKeyInsightsList';
import { DynamicInterventionsList } from './sections/DynamicInterventionsList';
import { DynamicHomeworkList } from './sections/DynamicHomeworkList';
import { treatmentService } from '../../../services/authAware/treatmentService';
import { usePatients } from '../../../hooks/usePatients';
import { useSubmitState } from '../../../hooks/useSubmitState';
import { SessionStatus, type CreateTreatmentData } from '../../../types/treatment';
import { ROUTES } from '../../../constants/routes';
import { formatEnumValue } from '../../../utils/stringUtils';

export const AddTreatment = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  
  if (!patientId) {
    navigate(ROUTES.THERAPIST.PATIENTS);
    return null;
  }

  const { patients, state: patientState, error: patientError } = usePatients();
  const { submitState, setSubmitState } = useSubmitState();

  const [formData, setFormData] = useState<CreateTreatmentData>({
    date: new Date().toISOString().split('T')[0],
    status: SessionStatus.DRAFT,
    patientNotes: [],
    treatmentNotes: [],
    keyInsights: [],
    interventions: [],
    homework: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormChange = <T,>(field: keyof CreateTreatmentData, value: T[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitState('submitting');
      await treatmentService.create(patientId, formData);
      setSubmitState('success');
      navigate(`${ROUTES.THERAPIST.PATIENTS}/${patientId}`);
    } catch (error) {
      console.error('Error creating treatment:', error);
      setSubmitState('error');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const patient = patients.find(p => p.id === patientId);

  if (patientState === 'loading') {
    return (
      <div className="p-6">
        <div className="text-center">Loading patient information...</div>
      </div>
    );
  }

  if (patientState === 'error' || patientError || !patient) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          Error loading patient information. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Add New Treatment</h2>
          <p className="text-gray-600 mt-1">
            For {patient.firstName} {patient.lastName}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date <span className="text-red-500" title="Required field">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Session Status <span className="text-red-500" title="Required field">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
                required
              >
                {Object.values(SessionStatus).map(status => (
                  <option key={status} value={status}>
                    {formatEnumValue(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <DynamicNotesList
              title="Patient Notes"
              notes={formData.patientNotes || []}
              onChange={(notes) => handleFormChange('patientNotes', notes)}
              placeholder="What did the patient share? Behaviors observed, emotions expressed..."
            />
          </div>

          <div className="p-4 border rounded-lg">
            <DynamicNotesList
              title="Treatment Notes"
              notes={formData.treatmentNotes || []}
              onChange={(notes) => handleFormChange('treatmentNotes', notes)}
              placeholder="Clinical observations, therapeutic insights, professional notes..."
            />
          </div>

          <div className="p-4 border rounded-lg">
            <DynamicKeyInsightsList
              insights={formData.keyInsights || []}
              onChange={(insights) => handleFormChange('keyInsights', insights)}
            />
          </div>

          <div className="p-4 border rounded-lg">
            <DynamicInterventionsList
              interventions={formData.interventions || []}
              onChange={(interventions) => handleFormChange('interventions', interventions)}
            />
          </div>

          <div className="p-4 border rounded-lg">
            <DynamicHomeworkList
              homework={formData.homework || []}
              onChange={(homework) => handleFormChange('homework', homework)}
            />
          </div>

          {submitState === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Failed to create treatment. Please try again.</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={submitState === 'submitting'}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitState === 'submitting'}
            >
              {submitState === 'submitting' ? 'Creating Treatment...' : 'Create Treatment'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};