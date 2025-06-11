import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { errorService } from '@/services/errorService';
import { performanceService } from '@/services/performanceService';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

// Configuration optimisée du QueryClient avec gestion d'erreurs
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Ne pas retry pour les erreurs 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (remplace cacheTime)
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
      onError: (error: any) => {
        errorService.captureError(error, 'QueryClient mutation error');
        performanceService.incrementErrors();
      }
    }
  }
});

// Gestionnaire global d'erreurs pour les queries
queryClient.getQueryCache().config.onError = (error: any) => {
  errorService.captureError(error, 'QueryClient query error');
  performanceService.incrementErrors();
};

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Une erreur s'est produite</h2>
        <p className="text-gray-600 mb-4">
          {error.message || "Une erreur inattendue s'est produite"}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const handleGlobalError = (error: Error, errorInfo: any) => {
    console.error('Erreur globale capturée:', error, errorInfo);
    errorService.captureError(error, 'Global error boundary');
    performanceService.incrementErrors();
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleGlobalError}
    >
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <FavoritesProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }
              }}
            />
          </FavoritesProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

}
