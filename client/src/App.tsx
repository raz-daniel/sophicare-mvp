import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { AuthPage } from './components/auth/AuthPage';
import { useAppSelector } from './hooks/useAppSelector';
import { getStoredTokens } from './services/authService';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { 
  children: React.ReactNode; 
  allowedRoles: string[] 
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const { accessToken } = getStoredTokens();

  // No token = not authenticated
  if (!accessToken) {
    return <Navigate to="/auth" replace />;
  }

  // Has token but no user data (page refresh case)
  // For MVP: allow access, role check will happen on API calls
  if (!user) {
    return <>{children}</>;  // Trust the token for now
  }

  // Full user data available - check role
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Placeholder components for protected routes
const Dashboard = () => <div>Therapist Dashboard !</div>;
const MyTreatments = () => <div>Patient Treatments</div>;
const Admin = () => <div>Admin Panel</div>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['therapist']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-treatments"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <MyTreatments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" />
      </Router>
    </Provider>
  );
}

export default App;