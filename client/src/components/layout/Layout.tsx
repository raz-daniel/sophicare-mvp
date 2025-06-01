import { Header } from './Header';
import { AppRoutes } from '../routing/AppRoutes';
import { Footer } from './Footer';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getStoredTokens } from '../../services/authService';
import { Sidebar } from './Sidebar';

export const Layout = () => {
    const { user } = useAppSelector((state) => state.auth);
    const { accessToken } = getStoredTokens();

    const showSidebar = accessToken && user;


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