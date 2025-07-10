import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ArrowLeft, SlidersHorizontal, List, MapPin } from 'lucide-react';
import { GeoSearchFilters, SearchResult } from '@/types/geosearch';
import GoogleMapsHeader from './components/GoogleMapsHeader';
import GoogleMapsMap from './components/GoogleMapsMap';
import GoogleMapsSidebar from './components/GoogleMapsSidebar';
import HorizontalCategoryScroll from './components/HorizontalCategoryScroll';
import GoogleMapsResultsList from './components/GoogleMapsResultsList';
import LocationDetailsPopup from './ui/LocationDetailsPopup';

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
  onBack
}) => {
  const isMobile = useIsMobile();
  const [selectedLocation, setSelectedLocation] = useState<SearchResult | null>(null);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [showResultsList, setShowResultsList] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.query || '');

  // État pour les catégories sélectionnées
  const selectedCategories = filters.category ? [filters.category] : [];

  const handleCategorySelect = (categoryId: string) => {
    onFiltersChange({ category: categoryId });
  };

  const handleCategoryRemove = (categoryId: string) => {
    onFiltersChange({ category: undefined });
  };

  const handleResultSelect = (result: SearchResult) => {
    setSelectedLocation(result);
    onLocationSelect({
      name: result.name,
      coordinates: result.coordinates,
      placeName: result.address || result.name
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleResultsList = () => {
    setShowResultsList(!showResultsList);
  };

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Sidebar - Style Google Maps */}
      <GoogleMapsSidebar
        isOpen={showSidebar}
        onToggle={toggleSidebar}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onResetFilters={onResetFilters}
        userLocation={userLocation}
        onMyLocationClick={onMyLocationClick}
        isLoading={isLoading}
      />

      {/* Zone principale */}
      <div className="flex-1 flex flex-col">
        {/* Header Google Maps */}
        <GoogleMapsHeader
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onLocationSelect={onLocationSelect}
          userLocation={userLocation}
          resultsCount={results.length}
          isLoading={isLoading}
          onBack={onBack}
          onToggleSidebar={toggleSidebar}
          showSidebar={showSidebar}
        />

      {/* Menu horizontal de catégories */}
      <HorizontalCategoryScroll
        selectedCategories={selectedCategories}
        onCategorySelect={handleCategorySelect}
        onCategoryRemove={handleCategoryRemove}
        onClearAll={onResetFilters}
        showSubcategories={true}
      />

      {/* Zone carte et résultats */}
        <div className="flex-1 flex overflow-hidden">
          {/* Carte maximisée */}
          <div className="flex-1 relative">
            <GoogleMapsMap
              results={results}
              userLocation={userLocation}
              filters={filters}
              onResultClick={handleResultSelect}
            />

            {/* Boutons flottants mobiles */}
            {isMobile && (
              <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-10">
                <Button
                  onClick={onMyLocationClick}
                  size="lg"
                  className="w-12 h-12 rounded-full shadow-lg bg-white text-gray-700 hover:bg-gray-50"
                  variant="outline"
                >
                  <MapPin className="h-5 w-5" />
                </Button>
                
                {results.length > 0 && (
                  <Button
                    onClick={toggleResultsList}
                    size="lg"
                    className="w-12 h-12 rounded-full shadow-lg bg-white text-gray-700 hover:bg-gray-50"
                    variant="outline"
                  >
                    <List className="h-5 w-5" />
                  </Button>
                )}
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
        <div className="fixed inset-x-0 bottom-0 top-1/3 bg-white z-50 rounded-t-xl shadow-2xl">
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