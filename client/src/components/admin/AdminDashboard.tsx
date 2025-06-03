import { useAppSelector } from '../../hooks/useAppSelector';

const AdminDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Hello, {user?.firstName} {user?.lastName}
      </h1>
      <p className="text-gray-600">Welcome to your Admin Dashboard</p>
    </div>
  );
};

export default AdminDashboard;
