export interface NavItem {
    path: string;
    label: string;
    icon: string;
  }
  
  export const NAVIGATION_CONFIG = {
    therapist: [
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
    ],
    patient: [
      { path: '/my-treatments', label: 'My Treatments', icon: '💊' },
      { path: '/appointments', label: 'Appointments', icon: '📅' },
      { path: '/progress', label: 'Progress', icon: '📈' },
    ],
    admin: [
      { path: '/admin', label: 'Admin Panel', icon: '⚙️' },
      { path: '/users', label: 'Users', icon: '👥' },
      { path: '/reports', label: 'Reports', icon: '📊' },
    ]
  } as const;