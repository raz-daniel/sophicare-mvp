import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';

export const Sidebar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const getNavItems = () => {
    switch (user?.role) {
      case 'therapist':
        return [
          { path: '/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/patients', label: 'Patients', icon: '👥' },
          { path: '/calendar', label: 'Calendar', icon: '📅' },
          { path: '/homework', label: 'Homework', icon: '📚' },
          { path: '/stats', label: 'Stats', icon: '📈' },
          { path: '/settings', label: 'Settings', icon: '⚙️' },
          { path: '/starred', label: 'Starred', icon: '⭐' },
          { path: '/add-patient', label: 'Add Patient', icon: '➕' },
          { path: '/add-treatment', label: 'Add Treatment', icon: '💊' },
          { path: '/add-appointment', label: 'Add Appointment', icon: '📝' },
        ];
      case 'patient':
        return [
          { path: '/my-treatments', label: 'My Treatments', icon: '💊' },
          { path: '/appointments', label: 'Appointments', icon: '📅' },
          { path: '/progress', label: 'Progress', icon: '📈' },
        ];
      case 'admin':
        return [
          { path: '/admin', label: 'Admin Panel', icon: '⚙️' },
          { path: '/users', label: 'Users', icon: '👥' },
          { path: '/reports', label: 'Reports', icon: '📊' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="p-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};