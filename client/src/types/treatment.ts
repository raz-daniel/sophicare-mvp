interface BaseTreatmentData {
    date: string;
    status?: SessionStatus;
  }
  
  interface BaseListItem {
    text: string;
    createdAt?: string;
  }
  
  interface BaseNote extends BaseListItem {
    importance: NoteImportance;
  }
  
  // Core treatment interfaces
  export interface CreateTreatmentData extends BaseTreatmentData {
    patientNotes?: PatientNote[];
    treatmentNotes?: TreatmentNote[];
    keyInsights?: KeyInsight[];        // NEW - Strategic highlights
    interventions?: Intervention[];
    homework?: Homework[];
  }
  
  export interface Treatment extends BaseTreatmentData {
    id: string;
    userId: string;
    patientId: string;
    patientNotes: PatientNote[];
    treatmentNotes: TreatmentNote[];
    keyInsights: KeyInsight[];         // NEW - Strategic highlights
    interventions: Intervention[];
    homework: Homework[];
    createdAt: string;
    updatedAt: string;
  }
  
  // Session documentation
  export interface PatientNote extends BaseNote {}
  export interface TreatmentNote extends BaseNote {}
  
  // Strategic insights - NEW
  export interface KeyInsight extends BaseListItem {
    category: InsightCategory;
    relatedTo: InsightSource;
  }
  
  export interface Intervention extends BaseListItem {
    method: string;
    description: string;
  }
  
  export interface Homework extends BaseListItem {
    task: string;
    assignedTo: HomeworkTarget;
    status: HomeworkStatus;
    notes?: string;
  }
  
  // Enums
  export enum SessionStatus {
    PLANNED = 'planned',
    IN_PROGRESS = 'inProgress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
  }
  
  export enum NoteImportance {
    NORMAL = 'normal',
    HIGHLIGHTED = 'highlighted'
  }
  
  // NEW - Key Insights Categories
  export enum InsightCategory {
    BREAKTHROUGH = 'breakthrough',      // Major progress/realization
    CONCERN = 'concern',               // Something to watch/address
    PATTERN = 'pattern',               // Recurring behavior/thought
    GOAL = 'goal',                     // Treatment objective/milestone
    PROGRESS = 'progress'              // Improvement noted
  }
  
  export enum InsightSource {
    PATIENT = 'patient',               // From patient notes/behavior
    TREATMENT = 'treatment',           // From clinical observation
    HOMEWORK = 'homework',             // From homework outcomes
    INTERVENTION = 'intervention'      // From intervention results
  }
  
  export enum HomeworkTarget {
    PATIENT = 'patient',
    THERAPIST = 'therapist',
    BOTH = 'both'
  }
  
  export enum HomeworkStatus {
    IN_PROGRESS = 'inProgress',
    FINISHED = 'finished',
    QUIT = 'quit',
    LEVEL_UP = 'levelUp',
    LEVEL_DOWN = 'levelDown'
  }