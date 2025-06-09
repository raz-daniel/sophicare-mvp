import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setActiveRole } from '../../store/slices/authSlice';
import { ROUTES } from '../../constants/routes';
import { UserRole } from '../../types/auth';

interface RoleOption {
  title: string;
  description: string;
  path: string;
  role: string;
}


export const RoleChoice = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  console.log('RoleChoice - user:', user);

  const roleOptions: RoleOption[] = [
    {
      title: "Care Provider - Workspace Access",
      description: "Manage treatments and clients",
      path: ROUTES.THERAPIST.DASHBOARD,
      role: UserRole.THERAPIST
    },
    {
      title: "Client Portal - Personal Care Space", 
      description: "View Treatments and progress",
      path: ROUTES.PATIENT.DASHBOARD,
      role: UserRole.PATIENT
    },
    {
      title: "Administrator - System Control",
      description: "Manage the system and permissions",
      path: ROUTES.ADMIN.DASHBOARD,
      role: UserRole.ADMIN
    }
  ].filter(option => user?.role.includes(option.role as UserRole));

  console.log('RoleChoice - roleOptions:', roleOptions);


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handleRoleSelect = (path: string, role: string) => {
    setSelectedRole(role);
    dispatch(setActiveRole(role as UserRole));
    navigate(path);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl w-full space-y-6"
      >
        {roleOptions.map((option, _index) => (
          <motion.div
            key={option.role}
            variants={item}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300
              ${selectedRole === option.role ? 'border-wood bg-wood bg-opacity-10' : 'border-earth hover:border-wood'}
            `}
            onClick={() => handleRoleSelect(option.path, option.role)}
          >
            <h2 className="text-2xl font-semibold text-wood">{option.title}</h2>
            <p className="mt-2 text-text">{option.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
