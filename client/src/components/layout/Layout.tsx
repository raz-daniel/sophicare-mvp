import { Header } from './Header';
import { AppRoutes } from '../routing/AppRoutes';
import { Footer } from './Footer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getCurrentUser } from '../../store/slices/authSlice';
import { useEffect } from 'react';
import { tokenService } from '../../services/auth/tokenService';

export const Layout = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    const token = tokenService.getAccessToken();
    if (token) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {isAuthenticated && location.pathname !== '/auth' && (
          <aside className="w-64 bg-gray-100 border-r">
            <Sidebar />
          </aside>
        )}
        <main className={`flex-1 ${isAuthenticated ? 'ml-0' : ''}`}>
          <AppRoutes />
        </main>
      </div>
      <Footer />
    </div>
  );
};