import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getStoredTokens } from '../../services/authService';

export const ProtectedRoute = ({ children, allowedRoles }: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const { accessToken } = getStoredTokens();

  if (!accessToken) {
    return <Navigate to="/auth" replace />;
  }

  if (!user) {
    return <>{children}</>;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};