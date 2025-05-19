
import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/theme-provider";

// Import components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import GeoSearch from "./pages/GeoSearch";
import ModernGeoSearch from "./pages/ModernGeoSearch";
import GeoSearchApp from "./pages/GeoSearchApp";
import Categories from "./pages/Categories";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Favorites from "./pages/Favorites";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Header />
          <div className="min-h-screen pt-16">
            <Suspense fallback={<div className="flex justify-center items-center h-screen">Chargement...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/geosearch" element={<GeoSearch />} />
                <Route path="/moderngeo" element={<ModernGeoSearch />} />
                <Route path="/geosearchapp" element={<GeoSearchApp />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
