import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, List, MapPin } from 'lucide-react';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import GoogleMapsMap from './components/GoogleMapsMap';
import ModernSidebar from './components/ModernSidebar';
import GoogleMapsResultsList from './components/GoogleMapsResultsList';
import AdaptiveMapCluster from '@/components/map/AdaptiveMapCluster';
import LocationDetailsPopup from './ui/LocationDetailsPopup';
import ExportPDFButton from './components/ExportPDFButton';
import MultiMapToggle from './MultiMapToggle';

interface GoogleMapsLayoutProps {
  filters: GeoSearchFilters;
  results: SearchResult[];
  userLocation: [number, number] | null;
  isLoading: boolean;
  onSearch: (query?: string) => void;
  onLocationSelect: (location: { name: string; coordinates: [number, number]; placeName: string }) => void;
  onMyLocationClick: () => void;
  onFiltersChange: (filters: Partial<GeoSearchFilters>) => void;
  onResetFilters: () => void;
  onBack: () => void;
  propShowSidebar: boolean;
  propToggleSidebar: () => void;
}

const GoogleMapsLayout: React.FC<GoogleMapsLayoutProps> = ({
  filters,
  results,
  userLocation,
  isLoading,
  onSearch,
  onLocationSelect,
  onMyLocationClick,
  onFiltersChange,
  onResetFilters,
  onBack,
  propShowSidebar,
  propToggleSidebar
}) => {
  const isMobile = useIsMobile();
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
  const [showResultsList, setShowResultsList] = useState(false);
  
  // État centralisé dans le parent GeoSearchApp
  const handleResultSelect = (result: SearchResult) => {
    setSelectedLocation(result);
    onLocationSelect({
      name: result.name,
      coordinates: result.coordinates,
      placeName: result.address || result.name
    });
  };


  const toggleResultsList = () => {
    setShowResultsList(!showResultsList);
  };

  const handleSidebarCategoryClick = (categoryId: string) => {
    // La logique des catégories est maintenant dans ModernSidebar
    console.log('Category selected:', categoryId);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Zone principale - Carte uniquement */}
      <div className="flex-1 flex flex-col order-1">
        {/* Zone carte et résultats */}
        <div className="flex-1 flex overflow-hidden">
          {/* Carte maximisée avec clustering adaptatif */}
          <div className="flex-1 relative">
            <GoogleMapsMap
              results={results}
              userLocation={userLocation}
              filters={filters}
              onResultClick={handleResultSelect}
            />

            {/* Boutons flottants mobile optimisés */}
            {isMobile && (
              <>
                <button
                  onClick={() => setShowResultsList(true)}
                  className="fixed bottom-4 left-4 z-30 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 text-sm font-medium shadow-lg hover:bg-white transition-colors flex items-center gap-2"
                >
                  <span className="text-gray-600">{results.length}</span>
                  <span className="text-gray-800">résultats</span>
                </button>

                <button
                  onClick={() => propToggleSidebar()}
                  className="fixed bottom-4 right-4 z-30 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-3 shadow-lg hover:bg-white transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                </button>
              </>
            )}

            {/* Bouton toggle desktop - En haut à droite de la carte */}
            {!isMobile && (
              <div className="absolute top-4 right-4 z-50">
                <MultiMapToggle />
              </div>
            )}
          </div>

          {/* Liste des résultats - Desktop uniquement */}
          {!isMobile && (
            <GoogleMapsResultsList
              results={results}
              isLoading={isLoading}
              onResultClick={handleResultSelect}
              onToggle={toggleResultsList}
              isOpen={showResultsList}
            />
          )}
        </div>
      </div>

      {/* Sidebar moderne - Adaptatif selon device */}
      <ModernSidebar
        isOpen={propShowSidebar}
        onToggle={propToggleSidebar}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onResetFilters={onResetFilters}
        userLocation={userLocation}
        onMyLocationClick={onMyLocationClick}
        isLoading={isLoading}
        results={results}
      />

      {/* Popup détails de lieu */}
      <LocationDetailsPopup
        location={selectedLocation}
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onNavigate={(coords) => {
          console.log('Navigate to:', coords);
        }}
      />

      {/* Sheet résultats mobile */}
      {isMobile && showResultsList && (
        <div className="fixed inset-x-0 bottom-0 top-1/3 bg-white z-40 rounded-t-xl shadow-2xl">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Résultats ({results.length})</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResultsList(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="flex-1 overflow-auto">
              <GoogleMapsResultsList
                results={results}
                isLoading={isLoading}
                onResultClick={handleResultSelect}
                onToggle={toggleResultsList}
                isOpen={true}
                mobile
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapsLayout;