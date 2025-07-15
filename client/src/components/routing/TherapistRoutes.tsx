import { Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import TherapistDashboard from '../therapist/dashboard/TherapistDashboard';
import { AddPatient } from '../therapist/patients/AddPatient';
import { AddTreatment } from '../therapist/treatments/AddTreatment';
import { PatientsList } from '../therapist/patients/PatientsList';
import { Calendar } from '../therapist/calendar/Calendar';
import { SelectPatientForTreatment } from '../therapist/treatments/SelectPatientForTreatment';
import { ROUTES } from '../../constants/routes';
import { UserRole } from '../../types/auth';
import { PatientDetail } from '../therapist/patients/PatientDetail';

export const TherapistRoutes = (
    <>
        <Route path={ROUTES.THERAPIST.DASHBOARD} element={
            <ProtectedRoute allowedRoles={[UserRole.THERAPIST]}>
                <TherapistDashboard />
            </ProtectedRoute>
        } />
        <Route path={ROUTES.THERAPIST.PATIENTS} element={
            <ProtectedRoute allowedRoles={[UserRole.THERAPIST]}>
                <PatientsList />
            </ProtectedRoute>
        } />
        <Route path={ROUTES.THERAPIST.ADD_PATIENT} element={
            <ProtectedRoute allowedRoles={[UserRole.THERAPIST]}>
                <AddPatient />
            </ProtectedRoute>
        } />
        <Route path={ROUTES.THERAPIST.PATIENT_TREATMENT} element={
            <ProtectedRoute allowedRoles={[UserRole.THERAPIST]}>
                <AddTreatment />
            </ProtectedRoute>
        } />
        <Route path={ROUTES.THERAPIST.ADD_TREATMENT} element={
            <ProtectedRoute allowedRoles={[UserRole.THERAPIST]}>
                <SelectPatientForTreatment />
            </ProtectedRoute>
        } />
        <Route path={ROUTES.THERAPIST.CALENDAR} element={
            <ProtectedRoute allowedRoles={[UserRole.THERAPIST]}>
                <Calendar />
            </ProtectedRoute>
        } />
        <Route path={ROUTES.THERAPIST.PATIENT_DETAIL} element={
            <ProtectedRoute allowedRoles={[UserRole.THERAPIST]}>
                <PatientDetail />
            </ProtectedRoute>
        } />
    </>
);