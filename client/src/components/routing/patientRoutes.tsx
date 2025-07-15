import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import PatientDashboard from '../patient/PatientDashboard';
import { ROUTES } from '../../constants/routes';
import { UserRole } from '../../types/auth';

export const PatientRoutes = (
  <>
    <Route path={ROUTES.PATIENT.DASHBOARD} element={
      <ProtectedRoute allowedRoles={[UserRole.PATIENT]}>
        <PatientDashboard />
      </ProtectedRoute>
    } />
    
  </>
);
