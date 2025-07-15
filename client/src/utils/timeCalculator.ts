export const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    
    const startDateTime = new Date();
    startDateTime.setHours(hours, minutes, 0, 0);
    
    const endDateTime = new Date(startDateTime.getTime() + (durationMinutes * 60 * 1000));
    
    const endHours = endDateTime.getHours().toString().padStart(2, '0');
    const endMinutes = endDateTime.getMinutes().toString().padStart(2, '0');
    
    return `${endHours}:${endMinutes}`;
  };
  
  export const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    return endTotalMinutes - startTotalMinutes;
  };
  
  export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
    
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  };
  
  export const isAppointmentInPast = (date: string, startTime: string): boolean => {
    const appointmentDate = new Date(date);
    const [startHour, startMin] = startTime.split(':').map(Number);
    const startDateTime = new Date(appointmentDate);
    startDateTime.setHours(startHour, startMin, 0, 0);
    
    return startDateTime < new Date();
  };
  
  export const calculateEndTimeForSession = (sessionType: string, startTime: string): string => {
    const defaultDurations: Record<string, number> = {
      therapy: 60,
      intake: 90,
      assessment: 120,
      follow_up: 30,
      group: 90,
    };
    
    const duration = defaultDurations[sessionType] || 60;
    return calculateEndTime(startTime, duration);
  };
  
  export const doTimePeriodsOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
    const start1Minutes = timeToMinutes(start1);
    const end1Minutes = timeToMinutes(end1);
    const start2Minutes = timeToMinutes(start2);
    const end2Minutes = timeToMinutes(end2);
    
    return start1Minutes < end2Minutes && start2Minutes < end1Minutes;
  };
  
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };