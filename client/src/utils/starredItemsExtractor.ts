import type { Treatment } from '../types/treatment';
import { NoteImportance, HomeworkStatus } from '../types/treatment';

// Timeline item that appears in patient detail
export interface TimelineItem {
  id: string;
  type: 'patientNote' | 'treatmentNote' | 'keyInsight' | 'intervention' | 'homework';
  content: string;
  treatmentDate: string;
  createdAt: string;
  importance: 'normal' | 'highlighted';
  metadata?: {
    category?: string;
    method?: string;
    assignedTo?: string;
    status?: string;
  };
}

// Groups timeline items by how recent they are
export interface TimelineGroups {
  today: TimelineItem[];
  thisWeek: TimelineItem[];
  thisMonth: TimelineItem[];
  older: TimelineItem[];
}

/**
 * Extracts highlighted patient notes from a single treatment
 */
export const extractHighlightedPatientNotes = (treatment: Treatment): TimelineItem[] => {
  if (!treatment.patientNotes) return [];
  
  return treatment.patientNotes
    .filter(note => note.importance === NoteImportance.HIGHLIGHTED)
    .map(note => ({
      id: `patient-note-${treatment.id}-${note.createdAt}`,
      type: 'patientNote' as const,
      content: note.text,
      treatmentDate: treatment.date,
      createdAt: note.createdAt,
      importance: 'highlighted' as const
    }));
};

/**
 * Extracts highlighted treatment notes from a single treatment
 */
export const extractHighlightedTreatmentNotes = (treatment: Treatment): TimelineItem[] => {
  if (!treatment.treatmentNotes) return [];
  
  return treatment.treatmentNotes
    .filter(note => note.importance === NoteImportance.HIGHLIGHTED)
    .map(note => ({
      id: `treatment-note-${treatment.id}-${note.createdAt}`,
      type: 'treatmentNote' as const,
      content: note.text,
      treatmentDate: treatment.date,
      createdAt: note.createdAt,
      importance: 'highlighted' as const
    }));
};

/**
 * Extracts all key insights from a single treatment (always important)
 */
export const extractAllKeyInsights = (treatment: Treatment): TimelineItem[] => {
  if (!treatment.keyInsights) return [];
  
  return treatment.keyInsights.map(insight => ({
    id: `insight-${treatment.id}-${insight.createdAt}`,
    type: 'keyInsight' as const,
    content: insight.text,
    treatmentDate: treatment.date,
    createdAt: insight.createdAt,
    importance: 'normal' as const,
    metadata: {
      category: insight.category
    }
  }));
};

/**
 * Extracts all interventions from a single treatment (always worth reviewing)
 */
export const extractAllInterventions = (treatment: Treatment): TimelineItem[] => {
  if (!treatment.interventions) return [];
  
  return treatment.interventions.map(intervention => ({
    id: `intervention-${treatment.id}-${intervention.createdAt}`,
    type: 'intervention' as const,
    content: intervention.description,
    treatmentDate: treatment.date,
    createdAt: intervention.createdAt,
    importance: 'normal' as const,
    metadata: {
      method: intervention.method
    }
  }));
};

/**
 * Extracts active homework from a single treatment (non-finished only)
 */
export const extractActiveHomework = (treatment: Treatment): TimelineItem[] => {
  if (!treatment.homework) return [];
  
  return treatment.homework
    .filter(hw => hw.status !== HomeworkStatus.FINISHED)
    .map(homework => ({
      id: `homework-${treatment.id}-${homework.createdAt}`,
      type: 'homework' as const,
      content: homework.task,
      treatmentDate: treatment.date,
      createdAt: homework.createdAt,
      importance: 'normal' as const,
      metadata: {
        assignedTo: homework.assignedTo,
        status: homework.status
      }
    }));
};

/**
 * Extracts all important items from a single treatment
 */
export const extractImportantItemsFromTreatment = (treatment: Treatment): TimelineItem[] => {
  return [
    ...extractHighlightedPatientNotes(treatment),
    ...extractHighlightedTreatmentNotes(treatment),
    ...extractAllKeyInsights(treatment),
    ...extractAllInterventions(treatment),
    ...extractActiveHomework(treatment)
  ];
};

/**
 * Extracts all important items from multiple treatments and sorts chronologically
 */
export const extractAndSortImportantItems = (treatments: Treatment[]): TimelineItem[] => {
  const allItems = treatments.flatMap(extractImportantItemsFromTreatment);
  
  // Sort by created date, newest first
  return allItems.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * Groups timeline items by how recent they are for emphasis
 */
export const groupTimelineItemsByRecency = (items: TimelineItem[]): TimelineGroups => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - (7 * 24 * 60 * 60 * 1000));
  const monthStart = new Date(todayStart.getTime() - (30 * 24 * 60 * 60 * 1000));

  return items.reduce((groups, item) => {
    const itemDate = new Date(item.createdAt);
    
    if (itemDate >= todayStart) {
      groups.today.push(item);
    } else if (itemDate >= weekStart) {
      groups.thisWeek.push(item);
    } else if (itemDate >= monthStart) {
      groups.thisMonth.push(item);
    } else {
      groups.older.push(item);
    }
    
    return groups;
  }, {
    today: [],
    thisWeek: [],
    thisMonth: [],
    older: []
  } as TimelineGroups);
};