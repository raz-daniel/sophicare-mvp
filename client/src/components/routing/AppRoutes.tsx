import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../auth/AuthPage';
import { ProtectedRoute } from './ProtectedRoute';
import TherapistDashboard from '../therapist/TherapistDashboard';
import PatientDashboard from '../patient/PatientDashboard';
import AdminDashboard from '../admin/AdminDashboard';
import { AddPatient } from '../therapist/AddPatient';
import { AddTherapy } from '../therapist/AddTherapy';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['therapist']}>
            <TherapistDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-patient"
        element={
          <ProtectedRoute allowedRoles={['therapist']}>
            <AddPatient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-therapy"
        element={
          <ProtectedRoute allowedRoles={['therapist']}>
            <AddTherapy />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-treatments"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};