
import { AppRoutes } from '@/routes';
import { ThemeProvider } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <AppRoutes />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
