// routing/therapistRoutes.tsx
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import TherapistDashboard from '../therapist/TherapistDashboard';
import { AddPatient } from '../therapist/AddPatient';
import { AddTreatment } from '../therapist/AddTreatment';
import { PatientsList } from '../therapist/PatientsList';
import { Calendar } from '../therapist/Calendar';

export const therapistRoutes = (
  <>
    <Route path="/dashboard" element={
      <ProtectedRoute allowedRoles={['therapist']}>
        <TherapistDashboard />
      </ProtectedRoute>
    } />
    <Route path="/patients" element={
      <ProtectedRoute allowedRoles={['therapist']}>
        <PatientsList />
      </ProtectedRoute>
    } />
    <Route path="/add-patient" element={
      <ProtectedRoute allowedRoles={['therapist']}>
        <AddPatient />
      </ProtectedRoute>
    } />
    <Route path="/add-treatment" element={
      <ProtectedRoute allowedRoles={['therapist']}>
        <AddTreatment />
      </ProtectedRoute>
    } />
    <Route path="/calendar" element={
      <ProtectedRoute allowedRoles={['therapist']}>
        <Calendar />
      </ProtectedRoute>
    } />
  </>
);