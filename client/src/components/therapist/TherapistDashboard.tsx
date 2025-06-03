import { useAppSelector } from '../../hooks/useAppSelector';
import { useNavigate } from 'react-router-dom';
import { AddPatient } from './AddPatient';

const TherapistDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center p-4">
        Dashboard for {user?.firstName} {user?.lastName}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Schedule Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Schedule</h2>
          <div className="flex gap-2 mb-4">
            <button className="px-3 py-1 bg-primary text-white rounded">Daily</button>
            <button className="px-3 py-1 bg-gray-200 rounded">Weekly</button>
          </div>
          <p className="text-gray-600">Your upcoming appointments will appear here</p>
        </div>

        {/* Patient List Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Patient List</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full p-2 border rounded"
            />
          </div>
          <p className="text-gray-600">Your patient list will appear here</p>
        </div>

        {/* Homework/Tasks Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Homework & Tasks</h2>
          <p className="text-gray-600">Assigned homework and tasks will appear here</p>
        </div>
        {/* Add Patient Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => navigate('/add-patient')} 
              className="px-4 py-2 bg-primary text-white rounded flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span>
              Add New Patient
            </button>
            <button
              onClick={() => navigate('/add-therapy')}
              className="px-4 py-2 bg-primary text-white rounded flex items-center justify-center gap-2 mt-2" 
            >
              <span className="text-xl">+</span>
              Add New Therapy
            </button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <button className="px-4 py-2 bg-primary text-white rounded">Add Patient</button>
            <button className="px-4 py-2 bg-primary text-white rounded">Add Treatment</button>
            <button className="px-4 py-2 bg-primary text-white rounded">Schedule Appointment</button>
          </div>
        </div>

        {/* Insights Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Insights</h2>
          <p className="text-gray-600">Patient progress and analytics will appear here</p>
        </div>

        {/* Notes Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Notes</h2>
          <textarea
            placeholder="Add a quick note..."
            className="w-full p-2 border rounded"
            rows={4}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
