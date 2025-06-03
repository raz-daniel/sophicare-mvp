// components/therapist/CreateAppointmentModal.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type CreateAppointmentData, SessionType } from '../../types/appointment';
import { type Patient } from '../../types/patient';
import { appointmentService } from '../../services/authAware/appointmentService';
import { patientService } from '../../services/authAware/patientService';

interface CreateAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedTime?: string;
  onAppointmentCreated: () => void;
}

export const CreateAppointmentModal = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  onAppointmentCreated
}: CreateAppointmentModalProps) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateAppointmentData>({
    patientId: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    startTime: selectedTime || '',
    endTime: '',
    sessionType: SessionType.THERAPY,
    title: '',
    notes: ''
  });

  // Load patients when modal opens
  useEffect(() => {
    if (isOpen) {
      loadPatients();
    }
  }, [isOpen]);

  // Update form when props change
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
    if (selectedTime) {
      setFormData(prev => ({
        ...prev,
        startTime: selectedTime
      }));
    }
  }, [selectedDate, selectedTime]);

  const loadPatients = async () => {
    try {
      const data = await patientService.getAll();
      setPatients(data.patients);
    } catch (error) {
      console.error('Error loading patients:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate end time when start time changes
    if (name === 'startTime' && value) {
      const [hours, minutes] = value.split(':').map(Number);
      const endTime = new Date();
      endTime.setHours(hours, minutes + 60); // Default 1 hour session
      const endTimeString = endTime.toTimeString().slice(0, 5);
      setFormData(prev => ({
        ...prev,
        endTime: endTimeString
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await appointmentService.create(formData);
      onAppointmentCreated();
      onClose();
      // Reset form
      setFormData({
        patientId: '',
        date: '',
        startTime: '',
        endTime: '',
        sessionType: SessionType.THERAPY,
        title: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4"
        >
          <h2 className="text-xl font-semibold mb-4">Create Appointment</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient *</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time *</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Session Type *</label>
              <select
                name="sessionType"
                value={formData.sessionType}
                onChange={handleChange}
                className="input-field"
                required
              >
                {Object.values(SessionType).map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Custom Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                placeholder="Leave empty for auto-generated title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="input-field h-20"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
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
                {loading ? 'Creating...' : 'Create Appointment'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};