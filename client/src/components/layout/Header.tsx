import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout, setActiveRole } from '../../store/slices/authSlice';
import FullLogo from '../../assets/SophieCare-Full-Logo.png';

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, activeRole } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRoleSwitch = (newRole: string) => {
    dispatch(setActiveRole(newRole));

    const roleRoutes = {
      therapist: '/dashboard',
      patient: '/my-treatments', 
      admin: '/admin'
    };

    const redirectPath = roleRoutes[newRole as keyof typeof roleRoutes] || '/';
    navigate(redirectPath);
  };
  
  return (
    <header className="bg-metal py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={FullLogo} alt="SophiCare Logo" className="h-10" />
        </Link>

        <div>
          {activeRole ? (
            <div className="flex items-center gap-4">
              {user && user.role.length > 1 && (
                <select 
                  value={activeRole} 
                  onChange={(e) => handleRoleSwitch(e.target.value)}
                  className="px-3 py-1 border rounded"
                >
                  {user.role.map(role => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              )}

              <span className="text-text">
                {user!.firstName.charAt(0).toUpperCase() + user!.firstName.slice(1)}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
