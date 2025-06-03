interface AppointmentBase {
    patientId: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    sessionType: SessionType;
    notes?: string;
  }
  
  export interface CreateAppointmentData extends AppointmentBase {}
  
  export interface Appointment extends AppointmentBase {
    id: string;
    therapistId: string;
    duration: number;
    status: AppointmentStatus;
    createdAt: string;
    updatedAt: string;
  }
  
  export enum SessionType {
    INTAKE = 'intake',
    THERAPY = 'therapy', 
    FOLLOW_UP = 'follow_up',
    ASSESSMENT = 'assessment',
    GROUP = 'group'
  }
  
  export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    CONFIRMED = 'confirmed',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
    RESCHEDULED = 'rescheduled'
  }