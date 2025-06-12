
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from '@/components/ui/sonner';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

interface AppProviderProps {
  children: React.ReactNode;
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mx-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Oops! Une erreur s'est produite
        </h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'Une erreur inattendue s\'est produite'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Recharger la page
        </button>
      </div>
    </div>
  );
}

const logError = (error: Error, errorInfo: { componentStack: string }) => {
  console.error('Application Error:', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack
  });
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
    >
      <FavoritesProvider>
        {children}
        <Toaster position="top-right" />
      </FavoritesProvider>
    </ErrorBoundary>
  );
};

export default AppProvider;
