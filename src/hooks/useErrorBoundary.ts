
import { useCallback, useState } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
}

interface UseErrorBoundaryReturn {
  error: ErrorInfo | null;
  hasError: boolean;
  captureError: (error: Error, errorInfo?: { componentStack: string }) => void;
  clearError: () => void;
}

export const useErrorBoundary = (): UseErrorBoundaryReturn => {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const captureError = useCallback((error: Error, errorInfo?: { componentStack: string }): void => {
    const errorData: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack
    };
    
    setError(errorData);
    console.error('Error captured:', errorData);
  }, []);

  const clearError = useCallback((): void => {
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
