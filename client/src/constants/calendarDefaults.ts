import { type View } from 'react-big-calendar';

export const DEFAULT_CALENDAR_HOURS = {
  start: { hour: 8, minute: 0 },
  end: { hour: 20, minute: 0 }
} as const;

export const DEFAULT_TIME_SLOTS = {
  step: 30,
  timeslots: 2
} as const;

export const CALENDAR_VIEWS: View[] = ['month', 'week', 'day'];
export const DEFAULT_CALENDAR_VIEW: View = 'week';

export const CALENDAR_FORMATS = {
  timeGutterFormat: 'HH:mm',
  eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => {
    const formatTime = (date: Date) => 
      date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
    return `${formatTime(start)} - ${formatTime(end)}`;
  }
} as const;

export const CALENDAR_STYLES = {
  height: '600px',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  padding: '24px'
} as const;

export const CALENDAR_DATE_LIMITS = {
  createMinDate: () => new Date(2024, 0, 1, DEFAULT_CALENDAR_HOURS.start.hour, DEFAULT_CALENDAR_HOURS.start.minute),
  createMaxDate: () => new Date(2030, 11, 31, DEFAULT_CALENDAR_HOURS.end.hour, DEFAULT_CALENDAR_HOURS.end.minute)
} as const;