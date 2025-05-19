
import { Routes, Route } from "react-router-dom";
import Index from '@/pages/Index';
import About from '@/pages/About';
import Categories from '@/pages/Categories';
import GeoSearch from '@/pages/GeoSearch';
import NotFound from '@/pages/NotFound';
import { ThemeProvider } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import TermsOfService from '@/pages/TermsOfService';
import Privacy from '@/pages/Privacy';
import Premium from '@/pages/Premium';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/geosearch" element={<GeoSearch />} />
          <Route path="/conditions" element={<TermsOfService />} />
          <Route path="/confidentialite" element={<Privacy />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
