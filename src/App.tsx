
import { AppRoutes } from '@/routes';
import { ThemeProvider } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from 'react-error-boundary';

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

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Erreur de l\'application:', error, errorInfo);
      }}
    >
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="flex flex-col min-h-screen">
          <AppRoutes />
          <Toaster />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
