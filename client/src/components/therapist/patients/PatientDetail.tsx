import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Plus, ArrowLeft, User } from 'lucide-react';
import { usePatients } from '../../../hooks/usePatients';
import { usePatientTreatments } from '../../../hooks/usePatientTreatments';
import { StarredItem } from '../shared/StarredItem';
import { getPatientStatusStyle, formatPatientStatus } from '../../../utils/patientUtils';
import { ROUTES } from '../../../constants/routes';
import type { TimelineItem } from '../../../utils/starredItemsExtractor';

export const PatientDetail = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  
  if (!patientId) {
    navigate(ROUTES.THERAPIST.PATIENTS);
    return null;
  }

  const { patients, state: patientsState, error: patientsError } = usePatients();
  const { 
    timelineGroups, 
    isLoading: treatmentsLoading, 
    error: treatmentsError 
  } = usePatientTreatments({ patientId });

  const patient = patients.find(p => p.id === patientId);

  const renderLoadingState = () => (
    <div className="p-6">
      <div className="text-center">Loading patient information...</div>
    </div>
  );

  const renderErrorState = () => (
    <div className="p-6">
      <div className="text-center text-red-600">
        {patientsError || treatmentsError || 'Error loading patient information'}
      </div>
    </div>
  );

  const renderPatientHeader = () => {
    if (!patient) return null;

    const getLastTreatmentText = (): string => {
      if (!patient.lastTreatmentDate) return 'No treatments yet';
      
      const lastDate = new Date(patient.lastTreatmentDate);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    };

    return (
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={24} className="text-gray-500" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getPatientStatusStyle(patient.status)}`}>
                  {formatPatientStatus(patient.status)}
                </span>
                <span className="text-sm text-gray-500">
                  Last session: {getLastTreatmentText()}
                </span>
                <span className="text-sm text-gray-500">
                  Total sessions: {patient.treatmentCount || 0}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="btn-secondary flex items-center gap-2">
              <Calendar size={16} />
              Schedule
            </button>
            <Link 
              to={`${ROUTES.THERAPIST.PATIENTS}/${patientId}/add-treatment`}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={16} />
              Add Treatment
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderTimelineSection = (title: string, items: TimelineItem[], isHighlighted = false) => {
    if (items.length === 0) return null;

    return (
      <div className={`mb-8 ${isHighlighted ? 'ring-2 ring-blue-200 rounded-lg p-4' : ''}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isHighlighted ? 'text-blue-800' : 'text-gray-800'}`}>
          {title} ({items.length})
        </h3>
        <div className="space-y-4">
          {items.map((item) => (
            <StarredItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  };

  const renderTimelineContent = () => {
    const hasAnyItems = timelineGroups.today.length > 0 || 
                      timelineGroups.thisWeek.length > 0 || 
                      timelineGroups.thisMonth.length > 0 || 
                      timelineGroups.older.length > 0;

    if (treatmentsLoading) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading treatment history...</p>
        </div>
      );
    }

    if (!hasAnyItems) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No important items found</p>
          <p className="text-gray-400 text-sm mb-6">
            Important items include starred notes, insights, interventions, and active homework
          </p>
          <Link 
            to={`${ROUTES.THERAPIST.PATIENTS}/${patientId}/add-treatment`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Add First Treatment
          </Link>
        </div>
      );
    }

    return (
      <div>
        {renderTimelineSection('Today', timelineGroups.today, true)}
        {renderTimelineSection('This Week', timelineGroups.thisWeek)}
        {renderTimelineSection('This Month', timelineGroups.thisMonth)}
        {renderTimelineSection('Older', timelineGroups.older)}
      </div>
    );
  };

  // Loading and error states
  if (patientsState === 'loading' || !patient) {
    return renderLoadingState();
  }

  if (patientsState === 'error' || patientsError) {
    return renderErrorState();
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.THERAPIST.PATIENTS)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={16} />
          Back to Patients
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {renderPatientHeader()}
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Important Timeline</h2>
            <p className="text-gray-600 mt-1">
              Key moments, insights, and active items from all sessions
            </p>
          </div>
          
          {renderTimelineContent()}
        </div>
      </motion.div>
    </div>
  );
};