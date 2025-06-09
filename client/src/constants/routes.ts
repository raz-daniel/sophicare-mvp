export const ROUTES = {
  NOT_FOUND: '/404',
  AUTH: '/auth',
  ROLE_CHOICE: '/role-choice',

  THERAPIST: {
    DASHBOARD: '/pro/dashboard',
    PATIENTS: '/pro/patients',
    PATIENT_TREATMENT: '/pro/patients/:patientId/add-treatment',
    ADD_PATIENT: '/pro/add-patient',
    ADD_TREATMENT: '/pro/add-treatment',
    PATIENT_DETAIL: '/pro/patients/:patientId',
    CALENDAR: '/pro/calendar'
  },

  PATIENT: {
    DASHBOARD: '/member/dashboard',
    TREATMENTS: '/member/treatments',
    PROFILE: '/member/profile'
  },

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings'
  },

  API: {
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    AUTH_REFRESH: '/auth/refresh',
    AUTH_ME: '/auth/me',
    AUTH_LOGOUT: '/auth/logout',
    
    PRO_PATIENTS: '/pro/patients',
    PRO_PATIENT_TREATMENTS: '/pro/patients/:patientId/treatments',
    PRO_TREATMENTS: '/pro/treatments',
    PRO_APPOINTMENTS: '/pro/appointments'
  }
} as const;