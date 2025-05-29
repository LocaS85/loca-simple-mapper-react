
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { errorService } from '@/services/errorService';
import { performanceService } from '@/services/performanceService';

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
        errorService.captureError(error, {
          component: 'QueryClient',
          action: 'mutation-error'
        });
        performanceService.incrementErrors();
      }
    }
  }
});

// Gestionnaire global d'erreurs pour les queries
queryClient.getQueryCache().config.onError = (error: any) => {
  errorService.captureError(error, {
    component: 'QueryClient',
    action: 'query-error'
  });
  performanceService.incrementErrors();
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const handleGlobalError = (error: Error, errorInfo: any) => {
    console.error('Erreur globale capturée:', error, errorInfo);
    performanceService.incrementErrors();
  };

  return (
    <ErrorBoundary onError={handleGlobalError}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
