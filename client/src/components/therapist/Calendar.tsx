// components/therapist/Calendar.tsx
import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, type View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CreateAppointmentModal } from './CreateAppointmentModal';
import { appointmentService } from '../../services/authAware/appointmentService';
import type { Appointment } from '../../types/appointment';

const localizer = momentLocalizer(moment);

export const Calendar = () => {
  const [view, setView] = useState<View>('week');
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  // Load appointments when date/view changes
  useEffect(() => {
    loadAppointments();
  }, [date, view]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on current view
      let startDate: string, endDate: string;
      
      if (view === 'month') {
        const start = moment(date).startOf('month').startOf('week');
        const end = moment(date).endOf('month').endOf('week');
        startDate = start.format('YYYY-MM-DD');
        endDate = end.format('YYYY-MM-DD');
      } else if (view === 'week') {
        const start = moment(date).startOf('week');
        const end = moment(date).endOf('week');
        startDate = start.format('YYYY-MM-DD');
        endDate = end.format('YYYY-MM-DD');
      } else { // day view
        startDate = moment(date).format('YYYY-MM-DD');
        endDate = startDate;
      }

      const data = await appointmentService.getByDateRange(startDate, endDate);
      
      // Transform appointments for BigCalendar format
      const calendarEvents = data.map((appointment: Appointment) => ({
        id: appointment.id,
        title: appointment.title,
        start: new Date(`${appointment.date.split('T')[0]}T${appointment.startTime}`),
        end: new Date(`${appointment.date.split('T')[0]}T${appointment.endTime}`),
        resource: {
          patientId: appointment.patientId,
          sessionType: appointment.sessionType,
          status: appointment.status,
          notes: appointment.notes
        }
      }));

      setAppointments(calendarEvents);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (event: any) => {
    console.log('Selected appointment:', event);
    // TODO: Open appointment details/edit modal
    alert(`Appointment: ${event.title}\nStatus: ${event.resource.status}`);
  };

  const handleSelectSlot = (slotInfo: any) => {
    console.log('Selected slot:', slotInfo);
    
    // Set selected date and time for modal
    setSelectedDate(slotInfo.start);
    
    // Extract time from selected slot
    const timeString = moment(slotInfo.start).format('HH:mm');
    setSelectedTime(timeString);
    
    // Open modal
    setIsModalOpen(true);
  };

  const handleNewAppointment = () => {
    // Open modal without pre-selected date/time
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setIsModalOpen(true);
  };

  const handleAppointmentCreated = () => {
    // Reload appointments after creating new one
    loadAppointments();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  // Custom event styling
  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3174ad';
    
    switch (event.resource.status) {
      case 'confirmed':
        backgroundColor = '#10b981'; // green
        break;
      case 'completed':
        backgroundColor = '#6b7280'; // gray
        break;
      case 'cancelled':
        backgroundColor = '#ef4444'; // red
        break;
      case 'no_show':
        backgroundColor = '#f59e0b'; // yellow
        break;
      default:
        backgroundColor = '#3174ad'; // blue (scheduled)
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <button 
          onClick={handleNewAppointment}
          className="btn-primary"
        >
          New Appointment
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6" style={{ height: '600px' }}>
        <BigCalendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={true}
          popup={true}
          views={['month', 'week', 'day']}
          defaultView="week"
          step={30}
          timeslots={2}
          min={new Date(2025, 0, 1, 8, 0)} // 8 AM
          max={new Date(2025, 0, 1, 20, 0)} // 8 PM
          eventPropGetter={eventStyleGetter}
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }) => 
              `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
          }}
        />
      </div>

      {/* Create Appointment Modal */}
      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onAppointmentCreated={handleAppointmentCreated}
      />
    </div>
  );
};