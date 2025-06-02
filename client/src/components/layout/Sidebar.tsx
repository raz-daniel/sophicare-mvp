
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { getNavigationItems } from '../../services/navigationService';

export const Sidebar = () => {
  const { activeRole } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navItems = getNavigationItems(activeRole);

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