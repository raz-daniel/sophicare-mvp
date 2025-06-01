import { Link } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import FullLogo from '../../assets/SophieCare-Full-Logo.png';

export const Header = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-metal py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={FullLogo} alt="SophiCare Logo" className="h-10" />
        </Link>

        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-text">
                {user.firstName} {user.lastName}
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
