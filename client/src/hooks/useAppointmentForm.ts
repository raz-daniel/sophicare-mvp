import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { SessionType } from '../types/appointment';
import { appointmentService } from '../services/authAware/appointmentService';
import { createAppointmentFormSchema, type CreateAppointmentFormData, isAppointmentInPast } from '../validation/appointmentValidation';
import { calculateEndTimeForSession, calculateDuration } from '../utils/timeCalculator';

interface UseAppointmentFormProps {
  selectedDate?: Date;
  selectedTime?: string;
  onSuccess: () => void;
  onClose: () => void;
}

interface UseAppointmentFormReturn {
  formData: CreateAppointmentFormData;
  validationErrors: Record<string, string>;
  updateFormField: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  submitForm: (e: React.FormEvent) => Promise<void>;
  clearForm: () => void;
  isSubmitting: boolean;
}

const createEmptyForm = (): CreateAppointmentFormData => ({
  patientId: '',
  date: '',
  startTime: '',
  endTime: '',
  sessionType: SessionType.THERAPY,
  title: '',
  notes: ''
});

export const useAppointmentForm = ({
  selectedDate,
  selectedTime,
  onSuccess,
  onClose
}: UseAppointmentFormProps): UseAppointmentFormReturn => {
  const [formData, setFormData] = useState<CreateAppointmentFormData>(createEmptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedTime) {
      setFormData(prev => ({
        ...prev,
        startTime: selectedTime,
        endTime: calculateEndTimeForSession(prev.sessionType, selectedTime)
      }));
    }
  }, [selectedTime]);

  const isFormValid = (data: CreateAppointmentFormData): boolean => {
    try {
      createAppointmentFormSchema.parse(data);
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
      }
      
      setValidationErrors(fieldErrors);
      return false;
    }
  };

  const notifyIfPastAppointment = (data: CreateAppointmentFormData): void => {
    if (isAppointmentInPast(data.date, data.startTime)) {
      toast('⚠️ This appointment is scheduled in the past', {
        duration: 4000,
        style: {
          background: '#f59e0b',
          color: 'white',
        }
      });
    }
  };

  const calculateEndTimeIfNeeded = (fieldName: string, fieldValue: string, currentForm: CreateAppointmentFormData) => {
    if (fieldName === 'startTime' || fieldName === 'sessionType') {
      const timeToUse = fieldName === 'startTime' ? fieldValue : currentForm.startTime;
      const sessionToUse = fieldName === 'sessionType' ? fieldValue : currentForm.sessionType;
      
      if (timeToUse) {
        return calculateEndTimeForSession(sessionToUse, timeToUse);
      }
    }
    return currentForm.endTime;
  };

  const clearFieldError = (fieldName: string): void => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => {
        const { [fieldName]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const updateFormField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
      endTime: calculateEndTimeIfNeeded(name, value, prev)
    }));
    
    clearFieldError(name);
  };

  const submitForm = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!isFormValid(formData)) {
      toast.error('Please fix the form errors before submitting');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      notifyIfPastAppointment(formData);
      
      const appointmentData = {
        ...formData,
        duration: calculateDuration(formData.startTime, formData.endTime)
      };
      
      await appointmentService.create(appointmentData);
      
      setIsSubmitting(false);
      toast.success('Appointment created successfully');
      onSuccess();
      onClose();
      clearForm();
      
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to create appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = (): void => {
    setFormData(createEmptyForm());
    setValidationErrors({});
  };

  return {
    formData,
    validationErrors,
    updateFormField,
    submitForm,
    clearForm,
    isSubmitting
  };
};