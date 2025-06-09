import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { AuthPage } from '../auth/AuthPage';
import { RoleChoice } from './RoleChoice';
import { ROUTES } from '../../constants/routes';
import { UserRole } from '../../types/auth';
import { TherapistRoutes } from './TherapistRoutes';
import { PatientRoutes } from './PatientRoutes';
import { AdminRoutes } from './AdminRoutes';

const RootRedirect = () => {
  const { activeRole, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  if (!activeRole) {
    return <Navigate to={ROUTES.ROLE_CHOICE} replace />;
  }

  const dashboardRoute = {
    [UserRole.THERAPIST]: ROUTES.THERAPIST.DASHBOARD,
    [UserRole.PATIENT]: ROUTES.PATIENT.DASHBOARD,
    [UserRole.ADMIN]: ROUTES.ADMIN.DASHBOARD
  }
  return <Navigate to={dashboardRoute[activeRole as keyof typeof dashboardRoute]} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.AUTH} element={<AuthPage />} />
      <Route path={ROUTES.ROLE_CHOICE} element={<RoleChoice />} />
      {TherapistRoutes}
      {PatientRoutes}
      {AdminRoutes}
      <Route path="/" element={<RootRedirect />} />
    </Routes>
  );
};
