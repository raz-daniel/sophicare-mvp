import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, User } from 'lucide-react';
import { usePatients } from '../../../hooks/usePatients';
import { useSearch } from '../../../hooks/useSearch';
import { ROUTES } from '../../../constants/routes';
import type { Patient } from '../../../types/patient';
import { useCallback } from 'react';

export const SelectPatientForTreatment = () => {
  const navigate = useNavigate();
  const { patients, state, error } = usePatients();
  
  const searchFunction = useCallback((patient: Patient, term: string) =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
    (patient.email?.toLowerCase().includes(term.toLowerCase()) ?? false)
  , []);

  const { searchTerm, setSearchTerm, filteredItems: filteredPatients } = useSearch<Patient>(
    patients,
    searchFunction
  );

  const getPatientStatusStyle = (status: string | undefined): string => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      waiting_list: 'bg-yellow-100 text-yellow-800',
      paused: 'bg-gray-100 text-gray-800',
      completed: 'bg-purple-100 text-purple-800',
      inactive: 'bg-gray-100 text-gray-800',
      discharged: 'bg-red-100 text-red-800'
    } as const;
    
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';
  };

  const formatPatientStatus = (status: string | undefined): string => {
    return status?.replace('_', ' ') || 'Waiting List';
  };

  const handlePatientSelect = (patientId: string) => {
    navigate(`${ROUTES.THERAPIST.PATIENTS}/${patientId}/add-treatment`);
  };

  const handleAddNewPatient = () => {
    navigate(ROUTES.THERAPIST.ADD_PATIENT);
  };

  const handleCancel = () => {
    navigate(ROUTES.THERAPIST.DASHBOARD);
  };

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
          {error || 'Error loading patients. Please try again.'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Add Treatment</h1>
          <p className="text-gray-600">Select a patient to create a new treatment record</p>
        </div>

        {/* Search and Add Patient */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAddNewPatient}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add New Patient
            </button>
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-lg shadow-md">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center">
              {patients.length === 0 ? (
                <div>
                  <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No patients yet</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first patient</p>
                  <button onClick={handleAddNewPatient} className="btn-primary">
                    Add Your First Patient
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handlePatientSelect(patient.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                        {patient.email && <span>{patient.email}</span>}
                        {patient.phone && <span>{patient.phone}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPatientStatusStyle(patient.status)}`}>
                        {formatPatientStatus(patient.status)}
                      </span>
                      <div className="text-right text-sm text-gray-500">
                        <div>Created: {new Date(patient.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Cancel Button */}
        <div className="mt-6 text-center">
          <button onClick={handleCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};