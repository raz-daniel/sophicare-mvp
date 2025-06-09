import { AnimatePresence, motion } from 'framer-motion';
import { SessionType } from '../../../types/appointment';
import { usePatients } from '../../../hooks/usePatients';
import { useAppointmentForm } from '../../../hooks/useAppointmentForm';
import { formatEnumValue } from '../../../utils/stringUtils';

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
  const { patients, state: patientsState } = usePatients();
  const {
    formData,
    validationErrors,
    updateFormField,
    submitForm,
    isSubmitting
  } = useAppointmentForm({
    selectedDate,
    selectedTime,
    onSuccess: onAppointmentCreated,
    onClose
  });

  const renderPatientSelect = () => (
    <div>
      <label className="block text-sm font-medium mb-1">Patient *</label>
      <select
        name="patientId"
        value={formData.patientId}
        onChange={updateFormField}
        className="input-field"
        required
        disabled={patientsState === 'loading'}
      >
        <option value="">
          {patientsState === 'loading' ? 'Loading patients...' : 'Select Patient'}
        </option>
        {patients.map(patient => (
          <option key={patient.id} value={patient.id}>
            {patient.firstName} {patient.lastName}
          </option>
        ))}
      </select>
      {validationErrors.patientId && (
        <p className="text-red-500 text-sm mt-1">{validationErrors.patientId}</p>
      )}
    </div>
  );

  const renderDateField = () => (
    <div>
      <label className="block text-sm font-medium mb-1">Date *</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={updateFormField}
        className="input-field"
        required
      />
      {validationErrors.date && (
        <p className="text-red-500 text-sm mt-1">{validationErrors.date}</p>
      )}
    </div>
  );

  const renderTimeFields = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Start Time *</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={updateFormField}
          className="input-field"
          required
        />
        {validationErrors.startTime && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.startTime}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">End Time *</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={updateFormField}
          className="input-field"
          required
        />
        {validationErrors.endTime && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.endTime}</p>
        )}
      </div>
    </div>
  );

  const renderSessionTypeField = () => (
    <div>
      <label className="block text-sm font-medium mb-1">Session Type *</label>
      <select
        name="sessionType"
        value={formData.sessionType}
        onChange={updateFormField}
        className="input-field"
        required
      >
        {Object.values(SessionType).map(type => (
          <option key={type} value={type}>
            {formatEnumValue(type)}
          </option>
        ))}
      </select>
      {validationErrors.sessionType && (
        <p className="text-red-500 text-sm mt-1">{validationErrors.sessionType}</p>
      )}
    </div>
  );

  const renderOptionalFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">Custom Title</label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={updateFormField}
          className="input-field"
          placeholder="Leave empty for auto-generated title"
        />
        {validationErrors.title && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes || ''}
          onChange={updateFormField}
          className="input-field h-20"
          placeholder="Additional notes..."
        />
        {validationErrors.notes && (
          <p className="text-red-500 text-sm mt-1">{validationErrors.notes}</p>
        )}
      </div>
    </>
  );

  const renderFormActions = () => (
    <div className="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        onClick={onClose}
        className="btn-secondary"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Appointment'}
      </button>
    </div>
  );

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
          
          <form onSubmit={submitForm} className="space-y-4">
            {renderPatientSelect()}
            {renderDateField()}
            {renderTimeFields()}
            {renderSessionTypeField()}
            {renderOptionalFields()}
            {renderFormActions()}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};