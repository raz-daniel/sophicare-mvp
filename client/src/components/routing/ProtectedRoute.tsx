import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { tokenService } from '../../services/tokenService';

export const ProtectedRoute = ({ children, allowedRoles }: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) => {
  const { user, activeRole } = useAppSelector((state) => state.auth);
  const accessToken = tokenService.getAccessToken();
  console.log('ProtectedRoute check:', { accessToken: !!accessToken, user: !!user, activeRole, allowedRoles });

  if (!accessToken || !user || !activeRole || !allowedRoles.includes(activeRole)) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};