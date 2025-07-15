import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AdminDashboard from '../admin/AdminDashboard';
import { ROUTES } from '../../constants/routes';
import { UserRole } from '../../types/auth';

export const AdminRoutes = (
  <>
    <Route path={ROUTES.ADMIN.DASHBOARD} element={
      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
        <AdminDashboard />
      </ProtectedRoute>
    } />
  </>
);
