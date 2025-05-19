
import { Routes, Route } from "react-router-dom";
import Index from '@/pages/Index';
import About from '@/pages/About';
import Categories from '@/pages/Categories';
import GeoSearch from '@/pages/GeoSearch';
import NotFound from '@/pages/NotFound';
import { ThemeProvider } from '@/hooks/theme-provider';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/geosearch" element={<GeoSearch />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
