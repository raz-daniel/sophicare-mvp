import { useState, useEffect } from 'react';
import { patientService } from '../services/authAware/patientService';
import type { Patient } from '../types/patient';

type PatientsState = 'loading' | 'success' | 'error';

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [state, setState] = useState<PatientsState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setState('loading');
      const data = await patientService.getAll();
      setPatients(data.patients);
      setState('success');
    } catch (err) {
      setError('Failed to load patients');
      setState('error');
      console.error('Error loading patients:', err);
    }
  };

  return { patients, state, error, refetch: loadPatients };
};