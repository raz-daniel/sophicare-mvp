export const getPatientStatusStyle = (status: string | undefined): string => {
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
  
  export const formatPatientStatus = (status: string | undefined): string => {
    return status?.replace('_', ' ') || 'Waiting List';
  };