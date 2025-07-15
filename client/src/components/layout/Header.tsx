import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout, setActiveRole } from '../../store/slices/authSlice';
import FullLogo from '../../assets/SophieCare-Full-Logo.png';
import * as authService from '../../services/auth/authService';
import { capitalize } from '../../utils/stringUtils';

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, activeRole } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate('/')
  };

  const handleRoleSwitch = (newRole: string) => {
    dispatch(setActiveRole(newRole));
    navigate('/');
  };
  
  return (
    <header className="bg-metal py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={FullLogo} alt="SophiCare Logo" className="h-10" />
        </Link>

        {user && (
          <div className="flex items-center gap-4">
            {user.role.length > 1 && (
              <select 
                value={activeRole || ''} 
                onChange={(e) => handleRoleSwitch(e.target.value)}
                className="px-3 py-1 border rounded"
              >
                {user.role.map(role => (
                  <option key={role} value={role}>
                    {capitalize(role)}
                  </option>
                ))}
              </select>
            )}

            <span className="text-text">
              {capitalize(user.firstName)}
            </span>
            
            <button onClick={handleLogout} className="btn-secondary">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};