// components/therapist/treatments/AddTreatment.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DynamicNotesList } from './sections/DynamicNotesList';
import { DynamicKeyInsightsList } from './sections/DynamicKeyInsightsList';
import { DynamicInterventionsList } from './sections/DynamicInterventionsList';
import { treatmentService } from '../../../services/authAware/treatmentService';
import { patientService } from '../../../services/authAware/patientService';
import { 
  SessionStatus, 
  type CreateTreatmentData,
  type PatientNote,
  type TreatmentNote,
  type KeyInsight,
  type Intervention,
  type Homework
} from '../../../types/treatment';
import type { Patient } from '../../../types/patient';
import { DynamicHomeworkList } from './sections/DynamicHomeworkList';

export const AddTreatment = () => {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  const [formData, setFormData] = useState<CreateTreatmentData>({
    date: new Date().toISOString().split('T')[0], // Today's date
    status: SessionStatus.PLANNED,
    patientNotes: [],
    treatmentNotes: [],
    keyInsights: [],
    interventions: [],
    homework: []
  });

  // Load patient data
  useEffect(() => {
    if (patientId) {
      loadPatient();
    }
  }, [patientId]);

  const loadPatient = async () => {
    try {
      if (!patientId) return;
      const patientData = await patientService.getById(patientId);
      setPatient(patientData);
    } catch (error) {
      console.error('Error loading patient:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePatientNotesChange = (notes: PatientNote[]) => {
    setFormData(prev => ({ ...prev, patientNotes: notes }));
  };

  const handleTreatmentNotesChange = (notes: TreatmentNote[]) => {
    setFormData(prev => ({ ...prev, treatmentNotes: notes }));
  };

  const handleKeyInsightsChange = (insights: KeyInsight[]) => {
    setFormData(prev => ({ ...prev, keyInsights: insights }));
  };

  const handleInterventionsChange = (interventions: Intervention[]) => {
    setFormData(prev => ({ ...prev, interventions: interventions }));
  };

  const handleHomeworkChange = (homework: Homework[]) => {
    setFormData(prev => ({ ...prev, homework: homework }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;

    try {
      setLoading(true);
      await treatmentService.create(patientId, formData);
      navigate(`/dashboard`); // Navigate to treatment list
    } catch (error) {
      console.error('Error creating treatment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (!patient && patientId) {
    return (
      <div className="p-6">
        <div className="text-center">Loading patient information...</div>
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
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Add New Treatment</h2>
          {patient && (
            <p className="text-gray-600 mt-1">
              For {patient.firstName} {patient.lastName}
            </p>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Session Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
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
              <label className="block text-sm font-medium mb-1">Session Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
                required
              >
                {Object.values(SessionStatus).map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace(/([A-Z])/g, ' $1')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Patient Notes Section */}
          <div className="p-4 border rounded-lg">
            <DynamicNotesList
              title="Patient Notes"
              notes={formData.patientNotes || []}
              onChange={handlePatientNotesChange}
              placeholder="What did the patient share? Behaviors observed, emotions expressed..."
            />
          </div>

          {/* Treatment Notes Section */}
          <div className="p-4 border rounded-lg">
            <DynamicNotesList
              title="Treatment Notes"
              notes={formData.treatmentNotes || []}
              onChange={handleTreatmentNotesChange}
              placeholder="Clinical observations, therapeutic insights, professional notes..."
            />
          </div>

          {/* Key Insights Section */}
          <div className="p-4 border rounded-lg">
            <DynamicKeyInsightsList
              insights={formData.keyInsights || []}
              onChange={handleKeyInsightsChange}
            />
          </div>

          {/* Interventions Section */}
          <div className="p-4 border rounded-lg">
            <DynamicInterventionsList
              interventions={formData.interventions || []}
              onChange={handleInterventionsChange}
            />
          </div>

          {/* Homework Section */}
          <div className="p-4 border rounded-lg">
            <DynamicHomeworkList
              homework={formData.homework || []}
              onChange={handleHomeworkChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating Treatment...' : 'Create Treatment'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};