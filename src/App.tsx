
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import ResultsList from './components/ResultsList';
import { TransportMode, Category, Place } from './types';
import { fetchPlaces } from './api/mapbox';

const queryClient = new QueryClient();

const App = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode>('walking');
  const [radius, setRadius] = useState<number>(5); // in km
  const [maxResults, setMaxResults] = useState<number>(5);
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.error("Error getting location", error);
        // Default to Paris as fallback
        setUserLocation([2.3522, 48.8566]);
      }
    );
  }, []);

  const handleSearch = async () => {
    if (!userLocation || !searchQuery) return;
    
    try {
      const places = await fetchPlaces({
        query: searchQuery,
        proximity: userLocation,
        limit: maxResults,
        radius: unit === 'km' ? radius * 1000 : radius * 1609.34,
        categories: selectedCategory?.id ? [selectedCategory.id] : undefined
      });
      
      setResults(places);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleUseMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        console.error("Error getting location", error);
      }
    );
  };

  const handleSelectResult = (result: Place) => {
    console.log("Selected result:", result);
    // In a real app, you might pan the map or show details
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col h-screen bg-gray-50">
            {/* Header with Search */}
            <header className="bg-white shadow-sm z-10">
              <div className="container mx-auto">
                <Header />
                <div className="px-4 py-3">
                  <SearchBar 
                    value={searchQuery}
                    onChange={setSearchQuery}
                    onSearch={handleSearch}
                    onUseMyLocation={handleUseMyLocation}
                  />
                </div>
              </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Map */}
              <div className="flex-1 relative">
                <Routes>
                  <Route path="/" element={
                    <MapComponent 
                      center={userLocation}
                      results={results}
                      transportMode={transportMode}
                      radius={radius}
                      unit={unit}
                    />
                  } />
                  <Route path="/locations" element={
                    <MapComponent 
                      center={userLocation}
                      results={results}
                      transportMode={transportMode}
                      radius={radius}
                      unit={unit}
                    />
                  } />
                  <Route path="/about" element={
                    <div className="p-8 text-center">
                      <h1 className="text-2xl">À propos de LocaSimple</h1>
                      <p className="mt-4">Cette page est en cours de développement.</p>
                    </div>
                  } />
                </Routes>
              </div>

              {/* Filter Panel (mobile: bottom sheet, desktop: sidebar) */}
              <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                transportMode={transportMode}
                onTransportModeChange={setTransportMode}
                radius={radius}
                onRadiusChange={setRadius}
                maxResults={maxResults}
                onMaxResultsChange={setMaxResults}
                unit={unit}
                onUnitChange={setUnit}
              />

              {/* Results List */}
              {results.length > 0 && (
                <ResultsList 
                  results={results}
                  transportMode={transportMode}
                  onSelectResult={handleSelectResult}
                />
              )}
            </div>

            {/* Floating Action Button for Filters */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors md:hidden z-10"
              aria-label="Toggle filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
