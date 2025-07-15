import { useState, useEffect } from 'react';
import { treatmentService } from '../services/authAware/treatmentService';
import { extractAndSortImportantItems, groupTimelineItemsByRecency, type TimelineItem, type TimelineGroups } from '../utils/starredItemsExtractor';
import type { Treatment } from '../types/treatment';

interface UsePatientTreatmentsProps {
  patientId: string;
}

interface UsePatientTreatmentsReturn {
  treatments: Treatment[];
  importantItems: TimelineItem[];
  timelineGroups: TimelineGroups;
  isLoading: boolean;
  error: string | null;
  refetchTreatments: () => void;
}

export const usePatientTreatments = ({ patientId }: UsePatientTreatmentsProps): UsePatientTreatmentsReturn => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPatientTreatments = async () => {
    if (!patientId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await treatmentService.getByPatient(patientId);
      setTreatments(response.treatments);
      
    } catch (err: any) {
      console.error('Error loading patient treatments:', err);
      setError(err.response?.data?.message || 'Failed to load treatments');
    } finally {
      setIsLoading(false);
    }
  };

  const refetchTreatments = () => {
    loadPatientTreatments();
  };

  // Load treatments when patientId changes
  useEffect(() => {
    loadPatientTreatments();
  }, [patientId]);

  // Extract and process important items whenever treatments change
  const importantItems = extractAndSortImportantItems(treatments);
  const timelineGroups = groupTimelineItemsByRecency(importantItems);

  return {
    treatments,
    importantItems,
    timelineGroups,
    isLoading,
    error,
    refetchTreatments
  };
};