
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Header />
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/geosearch" element={<GeoSearch />} />
              <Route path="/moderngeo" element={<ModernGeoSearch />} />
              <Route path="/geosearchapp" element={<GeoSearchApp />} />
              <Route path="/categories" element={<Categories />} />
            </Routes>
          </div>
          <Footer />
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
