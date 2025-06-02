import { Header } from './Header';
import { AppRoutes } from '../routing/AppRoutes';
import { Footer } from './Footer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { tokenService } from '../../services/tokenService';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';

export const Layout = () => {
    const { activeRole } = useAppSelector((state) => state.auth);
    const accessToken = tokenService.getAccessToken();
    const location = useLocation();
    const showSidebar = accessToken && activeRole && location.pathname !== '/auth';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {showSidebar && (
          <aside className="w-64 bg-gray-100 border-r">
            <Sidebar />
          </aside>
        )}
        <main className={`flex-1 ${showSidebar ? 'ml-0' : ''}`}>
          <AppRoutes />
        </main>
      </div>
      <Footer />
    </div>
  );
};