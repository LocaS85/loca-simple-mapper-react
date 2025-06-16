
import { useCallback, useState } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
}

export const useErrorBoundary = () => {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const captureError = useCallback((error: Error, errorInfo?: { componentStack: string }) => {
    const errorData: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack
    };
    
    setError(errorData);
    console.error('Error captured:', errorData);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const hasError = Boolean(error);

  return {
    error,
    hasError,
    captureError,
    clearError
  };
};
