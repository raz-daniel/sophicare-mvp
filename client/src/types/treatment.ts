export enum SessionStatus {
  DRAFT = 'draft',
  PLANNED = 'planned',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum NoteImportance {
  NORMAL = 'normal',
  HIGHLIGHTED = 'highlighted'
}

export interface PatientNote {
  text: string;
  importance: NoteImportance;
  createdAt: string;
}

export interface TreatmentNote {
  text: string;
  importance: NoteImportance;
  createdAt: string;
}

export enum InsightCategory {
  BREAKTHROUGH = 'breakthrough',
  CONCERN = 'concern',
  PATTERN = 'pattern',
  GOAL = 'goal',
  PROGRESS = 'progress'
}

export enum InsightSource {
  PATIENT = 'patient',
  TREATMENT = 'treatment',
  HOMEWORK = 'homework',
  INTERVENTION = 'intervention'
}

export interface KeyInsight {
  text: string;
  category: InsightCategory;
  relatedTo: InsightSource;
  createdAt: string;
}

export interface Intervention {
  method: string;
  description: string;
  createdAt: string;
}

export enum HomeworkTarget {
  PATIENT = 'patient',
  THERAPIST = 'therapist',
  BOTH = 'both'
}

export enum HomeworkStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'inProgress',
  FINISHED = 'finished',
  QUIT = 'quit',
  LEVEL_UP = 'levelUp',
  LEVEL_DOWN = 'levelDown'
}

export interface Homework {
  text: string;
  task: string;
  assignedTo: HomeworkTarget;
  status: HomeworkStatus;
  notes?: string;
  createdAt: string;
}

export interface CreateTreatmentData {
  date: string;
  status?: SessionStatus;
  patientNotes?: PatientNote[];
  treatmentNotes?: TreatmentNote[];
  keyInsights?: KeyInsight[];
  interventions?: Intervention[];
  homework?: Homework[];
}

export interface Treatment extends CreateTreatmentData {
  id: string;
  userId: string;
  patientId: string;
  status: SessionStatus;
  patientNotes: PatientNote[];
  treatmentNotes: TreatmentNote[];
  keyInsights: KeyInsight[];
  interventions: Intervention[];
  homework: Homework[];
  createdAt: string;
  updatedAt: string;
}