
import { AppRoutes } from '@/routes';
import { ThemeProvider } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="flex flex-col min-h-screen">
          <AppRoutes />
          <Toaster />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
