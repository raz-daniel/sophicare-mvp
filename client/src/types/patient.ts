export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    gender?: Gender;
    address?: string;
    occupation?: string;
    maritalStatus?: MaritalStatus;
    children?: string;
    notes?: string;
    userId: string;
    status?: PatientStatus;
    treatmentCount?: number;
    lastTreatmentDate?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreatePatientData {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    gender?: Gender;
    address?: string;
    occupation?: string;
    maritalStatus?: MaritalStatus;
    children?: string;
    notes?: string;
    status?: PatientStatus;
  }
  
  export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'
  }
  
  export enum PatientStatus {
    ACTIVE = 'active',
    SCHEDULED = 'scheduled', 
    WAITING_LIST = 'waiting_list',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    INACTIVE = 'inactive',
    DISCHARGED = 'discharged'
  }

  export enum MaritalStatus {
    SINGLE = 'single',
    MARRIED = 'married',
    DIVORCED = 'divorced',
    WIDOWED = 'widowed',
    OTHER = 'other'
  }