
import React from 'react';
import { useGeoSearch } from '@/hooks/geosearch/useGeoSearch';
import GeoSearchLayout from './GeoSearchLayout';
import GeoSearchHeader from './layout/GeoSearchHeader';
import GeoSearchContent from './layout/GeoSearchContent';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const GeoSearchShell: React.FC = () => {
  const {
    userLocation,
    filters,
    results,
    isLoading,
    isMapboxReady,
    networkStatus,
    statusInfo,
    searchQuery,
    updateFiltersWithSearch,
    handleLocationSelect,
    handleSearch,
    handleMyLocationClick,
    performSearch,
    clearCache
  } = useGeoSearch();

  if (!isMapboxReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Initialisation des services de cartographie en cours...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleTransportChange = (transport: 'walking' | 'cycling' | 'driving' | 'transit') => {
    updateFiltersWithSearch({ transport });
  };

  return (
    <>
      <GeoSearchHeader
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onLocationSelect={handleLocationSelect}
        userLocation={userLocation}
        isLoading={isLoading}
        onMyLocationClick={handleMyLocationClick}
      />
      
      <GeoSearchContent
        filters={filters}
        results={results}
        isLoading={isLoading}
        userLocation={userLocation}
        networkStatus={networkStatus}
        statusInfo={statusInfo}
        onFiltersChange={updateFiltersWithSearch}
        onLocationSelect={handleLocationSelect}
        onTransportChange={handleTransportChange}
        onClearCache={clearCache}
      />
    </>
  );
};

export default GeoSearchShell;
