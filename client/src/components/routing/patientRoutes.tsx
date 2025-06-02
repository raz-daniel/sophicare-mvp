// routing/patientRoutes.tsx
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import PatientDashboard from '../patient/PatientDashboard';


export const patientRoutes = (
  <>
    <Route path="/my-dashboard" element={
      <ProtectedRoute allowedRoles={['patient']}>
        <PatientDashboard />
      </ProtectedRoute>
    } />

  </>
);
