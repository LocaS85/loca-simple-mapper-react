import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import MapComponent from './components/MapComponent';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import ResultsList from './components/ResultsList';
import { TransportMode, Category, Place } from './types';
import { fetchPlaces } from './api/mapbox';
import GeoSearchPage from './pages/GeoSearch';
import NotFound from './pages/NotFound';

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
            {/* Header with Navigation */}
            <div className="bg-white shadow-sm z-10">
              <div className="container mx-auto px-4">
                <Header />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={
                  <div className="flex flex-col h-full">
                    <div className="p-4">
                      <SearchBar 
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={handleSearch}
                        onUseMyLocation={handleUseMyLocation}
                      />
                    </div>
                    <div className="flex flex-1 overflow-hidden">
                      <MapComponent 
                        center={userLocation}
                        results={results}
                        transportMode={transportMode}
                        radius={radius}
                        unit={unit}
                      />
                      {results.length > 0 && (
                        <ResultsList 
                          results={results}
                          transportMode={transportMode}
                          onSelectResult={handleSelectResult}
                        />
                      )}
                    </div>
                  </div>
                } />
                <Route path="/geo" element={<GeoSearchPage />} />
                <Route path="/about" element={
                  <div className="container mx-auto p-8">
                    <h1 className="text-3xl font-bold mb-6">À propos de LocaSimple</h1>
                    <p className="text-lg mb-4">
                      LocaSimple est une application de géolocalisation qui vous permet de trouver facilement des lieux d'intérêt autour de vous.
                    </p>
                    <p className="text-lg mb-4">
                      Utilisez la recherche pour trouver des lieux spécifiques, filtrez par catégorie, distance ou mode de transport.
                    </p>
                    <h2 className="text-2xl font-semibold mt-8 mb-4">Fonctionnalités</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Recherche de lieux par nom ou type</li>
                      <li>Filtrage par catégorie (divertissement, santé, travail, etc.)</li>
                      <li>Sélection du nombre de résultats affichés</li>
                      <li>Définition du rayon de recherche</li>
                      <li>Choix du mode de transport</li>
                      <li>Visualisation des résultats sur une carte interactive</li>
                    </ul>
                  </div>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
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
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
