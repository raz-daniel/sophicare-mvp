// routing/adminRoutes.tsx
import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AdminDashboard from '../admin/AdminDashboard';

export const adminRoutes = (
  <>
    <Route path="/admin" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    } />
  </>
);
