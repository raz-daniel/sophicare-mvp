
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, User } from 'lucide-react';
import { patientService } from '../../../services/authAware/patientService';
import type { Patient } from '../../../types/patient';

export const SelectPatientForTreatment = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        // Filter patients based on search term
        if (searchTerm.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const filtered = patients.filter(patient =>
                `${patient.firstName} ${patient.lastName}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPatients(filtered);
        }
    }, [searchTerm, patients]);

    const loadPatients = async () => {
        try {
            setLoading(true);
            const data = await patientService.getAll();
            setPatients(data.patients);
            setFilteredPatients(data.patients);
        } catch (error) {
            console.error('Error loading patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePatientSelect = (patientId: string) => {
        navigate(`/patients/${patientId}/add-treatment`);
    };

    const handleAddNewPatient = () => {
        navigate('/add-patient');
    };

    const getStatusColor = (status: string | undefined) => {
        if (!status) return 'bg-gray-100 text-gray-800'; // Default for undefined
        
        switch (status) {
          case 'active':
            return 'bg-green-100 text-green-800';
          case 'scheduled':
            return 'bg-blue-100 text-blue-800';
          case 'waiting_list':
            return 'bg-yellow-100 text-yellow-800';
          case 'paused':
            return 'bg-gray-100 text-gray-800';
          case 'completed':
            return 'bg-purple-100 text-purple-800';
          case 'inactive':
            return 'bg-gray-100 text-gray-800';
          case 'discharged':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center">Loading patients...</div>
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
                                    <button
                                        onClick={handleAddNewPatient}
                                        className="btn-primary"
                                    >
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
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(patient.status || 'waiting_list')}`}>
                                                {patient.status?.replace('_', ' ') || 'Waiting List'}
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
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
};