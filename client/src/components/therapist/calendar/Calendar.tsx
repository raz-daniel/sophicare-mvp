import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer, type View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CreateAppointmentModal } from './CreateAppointmentModal';
import { appointmentService } from '../../../services/authAware/appointmentService';
import type { Appointment } from '../../../types/appointment';
import { 
  DEFAULT_TIME_SLOTS, 
  CALENDAR_VIEWS, 
  DEFAULT_CALENDAR_VIEW,
  CALENDAR_FORMATS,
  CALENDAR_STYLES,
  CALENDAR_DATE_LIMITS
} from '../../../constants/calendarDefaults';

const localizer = momentLocalizer(moment);

export const Calendar = () => {
  const [view, setView] = useState<View>(DEFAULT_CALENDAR_VIEW);
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  useEffect(() => {
    loadAppointments();
  }, [date, view]);

  const calculateDateRange = (currentDate: Date, currentView: View) => {
    switch (currentView) {
      case 'month':
        const startOfMonth = moment(currentDate).startOf('month').startOf('week');
        const endOfMonth = moment(currentDate).endOf('month').endOf('week');
        return {
          start: startOfMonth.format('YYYY-MM-DD'),
          end: endOfMonth.format('YYYY-MM-DD')
        };
      case 'week':
        const startOfWeek = moment(currentDate).startOf('week');
        const endOfWeek = moment(currentDate).endOf('week');
        return {
          start: startOfWeek.format('YYYY-MM-DD'),
          end: endOfWeek.format('YYYY-MM-DD')
        };
      case 'day':
        const dayFormat = moment(currentDate).format('YYYY-MM-DD');
        return {
          start: dayFormat,
          end: dayFormat
        };
      default:
        throw new Error(`Unsupported calendar view: ${currentView}`);
    }
  };

  const transformAppointmentToCalendarEvent = (appointment: Appointment) => ({
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
  });

  const getAppointmentStatusColor = (status: string): string => {
    const statusColors = {
      confirmed: '#10b981',    // green
      completed: '#6b7280',    // gray
      cancelled: '#ef4444',    // red
      no_show: '#f59e0b',      // yellow
      scheduled: '#3174ad',    // blue (default)
      rescheduled: '#8b5cf6'   // purple
    } as const;
    
    return statusColors[status as keyof typeof statusColors] || statusColors.scheduled;
  };

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      
      const { start, end } = calculateDateRange(date, view);
      const data = await appointmentService.getByDateRange(start, end);
      
      const calendarEvents = data.map(transformAppointmentToCalendarEvent);
      setAppointments(calendarEvents);
      
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEvent = (event: any) => {
    console.log('Selected appointment:', event);
    // TODO: Open appointment details/edit modal
    alert(`Appointment: ${event.title}\nStatus: ${event.resource.status}`);
  };

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedDate(slotInfo.start);
    setSelectedTime(moment(slotInfo.start).format('HH:mm'));
    setIsModalOpen(true);
  };

  const handleNewAppointment = () => {
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  const handleAppointmentCreated = () => {
    loadAppointments();
  };

  const eventStyleGetter = (event: any) => ({
    style: {
      backgroundColor: getAppointmentStatusColor(event.resource.status),
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    }
  });

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

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6" style={{ height: CALENDAR_STYLES.height }}>
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
          views={CALENDAR_VIEWS}
          defaultView={DEFAULT_CALENDAR_VIEW}
          step={DEFAULT_TIME_SLOTS.step}
          timeslots={DEFAULT_TIME_SLOTS.timeslots}
          min={CALENDAR_DATE_LIMITS.createMinDate()}
          max={CALENDAR_DATE_LIMITS.createMaxDate()}
          eventPropGetter={eventStyleGetter}
          formats={CALENDAR_FORMATS}
        />
      </div>

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