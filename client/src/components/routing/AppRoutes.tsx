// routing/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from '../auth/AuthPage';
import { therapistRoutes } from './TherapistRoutes';
import { patientRoutes } from './patientRoutes';
import { adminRoutes } from './adminRoutes';
import { RoleChoice } from './RoleChoice';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/role-choice" element={<RoleChoice />} />
      {therapistRoutes}
      {patientRoutes}
      {adminRoutes}
      <Route path="/" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};