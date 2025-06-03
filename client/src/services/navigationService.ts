// services/navigationService.ts
import { NAVIGATION_CONFIG } from '../config/navigation';
import type { UserRole } from '../types/auth';

export const getNavigationItems = (role: UserRole | null) => {
  if (!role || !NAVIGATION_CONFIG[role]) {
    return [];
  }
  return NAVIGATION_CONFIG[role];
};