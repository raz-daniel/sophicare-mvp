import { Link } from 'react-router-dom';
import { usePatients } from '../../../hooks/usePatients';
import { ROUTES } from '../../../constants/routes';
import { getPatientStatusStyle, formatPatientStatus } from '../../../utils/patientUtils';
import type { Patient } from '../../../types/patient';

export const PatientsList = () => {
  const { patients, state, error } = usePatients();

  if (state === 'loading') {
    return (
      <div className="p-6">
        <div className="text-center">Loading patients...</div>
      </div>
    );
  }

  if (state === 'error' || error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          {error || 'Failed to load patients'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PatientsHeader />
      
      {patients.length === 0 ? (
        <EmptyPatientsList />
      ) : (
        <PatientsTable patients={patients} />
      )}
    </div>
  );
};

// Sub-components for Single Responsibility

const PatientsHeader = () => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-2xl font-semibold">Patients</h1>
    <Link to={ROUTES.THERAPIST.ADD_PATIENT} className="btn-primary">
      Add New Patient
    </Link>
  </div>
);

const EmptyPatientsList = () => (
  <div className="text-center py-8">
    <p className="text-gray-500">No patients found</p>
    <Link to={ROUTES.THERAPIST.ADD_PATIENT} className="btn-primary mt-4 inline-block">
      Add Your First Patient
    </Link>
  </div>
);

const PatientsTable = ({ patients }: { patients: Patient[] }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <PatientsTableHeader />
        <tbody className="bg-white divide-y divide-gray-200">
          {patients.map((patient) => (
            <PatientRow key={patient.id} patient={patient} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PatientsTableHeader = () => {
  const headerClass = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className={headerClass}>Patient Name</th>
        <th className={headerClass}>Status</th>
        <th className={headerClass}>Last Session</th>
        <th className={headerClass}>Homework</th>
        <th className={headerClass}>Total Sessions</th>
        <th className={headerClass}>Actions</th>
      </tr>
    </thead>
  );
};

const PatientRow = ({ patient }: { patient: Patient }) => {
  // Helper functions for patient data
  const getLastSessionText = (lastTreatmentDate?: string): string => {
    if (!lastTreatmentDate) return 'No sessions';
    
    const lastDate = new Date(lastTreatmentDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getHomeworkStatus = (): { text: string; color: string } | null => {
    // TODO: This will be implemented when homework data is available
    // For now, return null (no homework shown)
    return null;
    
    // Future implementation when homework data is available:
    // const pendingHomework = patient.homework?.filter(hw => hw.status === 'pending').length || 0;
    // const overdueHomework = patient.homework?.filter(hw => hw.status === 'overdue').length || 0;
    // 
    // if (overdueHomework > 0) {
    //   return { text: `${overdueHomework} overdue`, color: 'text-red-600 bg-red-50' };
    // }
    // if (pendingHomework > 0) {
    //   return { text: `${pendingHomework} pending`, color: 'text-orange-600 bg-orange-50' };
    // }
    // return { text: 'Complete', color: 'text-green-600 bg-green-50' };
  };

  const homeworkStatus = getHomeworkStatus();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">
          {patient.firstName} {patient.lastName}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs rounded-full ${getPatientStatusStyle(patient.status)}`}>
          {formatPatientStatus(patient.status)}
        </span>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {getLastSessionText(patient.lastTreatmentDate)}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {homeworkStatus ? (
          <span className={`px-2 py-1 text-xs rounded-full ${homeworkStatus.color}`}>
            {homeworkStatus.text}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {(patient.treatmentCount || 0)} sessions
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex gap-2">
          <Link 
            to={`${ROUTES.THERAPIST.PATIENTS}/${patient.id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            View
          </Link>
          <Link 
            to={`${ROUTES.THERAPIST.PATIENTS}/${patient.id}/add-treatment`}
            className="text-green-600 hover:text-green-900"
          >
            Add Treatment
          </Link>
          <Link 
            to={`${ROUTES.THERAPIST.PATIENTS}/${patient.id}/edit`}
            className="text-blue-600 hover:text-blue-900"
          >
            Edit
          </Link>
        </div>
      </td>
    </tr>
  );
};