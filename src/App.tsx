
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import { ThemeProvider } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from 'react-error-boundary';
import PageFallback from '@/components/fallback/PageFallback';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <PageFallback 
      title="Erreur de l'application"
      message={error.message || "Une erreur inattendue s'est produite"}
      onRetry={resetErrorBoundary}
    />
  );
}

function App() {
  console.log('🚀 App component loading...');
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('❌ Erreur de l\'application:', error, errorInfo);
      }}
    >
      <BrowserRouter>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <div className="flex flex-col min-h-screen">
            <AppRoutes />
            <Toaster />
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
