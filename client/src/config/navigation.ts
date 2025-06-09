import { ROUTES } from "../constants/routes";
import { UserRole } from "../types/auth";

export interface NavItem {
    path: string;
    label: string;
    icon: string;
  }
  
  export const NAVIGATION_CONFIG: Record<UserRole, NavItem[]> = {
    [UserRole.THERAPIST]: [
      { path: ROUTES.THERAPIST.DASHBOARD, label: 'Dashboard', icon: '📊' },
      { path: ROUTES.THERAPIST.PATIENTS, label: 'Patients', icon: '👥' },
      { path: ROUTES.THERAPIST.CALENDAR, label: 'Calendar', icon: '📅' },
      { path: ROUTES.THERAPIST.ADD_PATIENT, label: 'Add Patient', icon: '➕' },
      { path: ROUTES.THERAPIST.ADD_TREATMENT, label: 'Add Treatment', icon: '💊' },
    ],
    [UserRole.PATIENT]: [
      { path: ROUTES.PATIENT.DASHBOARD, label: 'My Treatments', icon: '💊' },
    ],
    [UserRole.ADMIN]: [
      { path: ROUTES.ADMIN.DASHBOARD, label: 'Admin Panel', icon: '⚙️' },
      { path: ROUTES.ADMIN.USERS, label: 'Users', icon: '👥' },
    ]
  } as const;