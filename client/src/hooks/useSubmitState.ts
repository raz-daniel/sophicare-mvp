import { useState } from 'react';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export const useSubmitState = () => {
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  
  const isSubmitting = submitState === 'submitting';
  const isSuccess = submitState === 'success';
  const isError = submitState === 'error';
  const isIdle = submitState === 'idle';
  
  return { 
    submitState, 
    setSubmitState,
    isSubmitting,
    isSuccess, 
    isError,
    isIdle
  };
};