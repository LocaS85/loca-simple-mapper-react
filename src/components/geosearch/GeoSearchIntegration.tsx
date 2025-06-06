
import React from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { TransportMode } from '@/lib/data/transportModes';
import { GeoSearchFilters } from '@/types/geosearch';

interface GeoSearchIntegrationProps {
  children: React.ReactNode;
}

export const GeoSearchIntegration: React.FC<GeoSearchIntegrationProps> = ({ children }) => {
  const { filters, userLocation, results, isLoading } = useGeoSearchStore();

  // Provide context for child components
  const contextValue = {
    filters,
    userLocation,
    results,
    isLoading,
    // Helper functions for backwards compatibility
    selectedCategory: filters.category,
    transport: filters.transport,
    radius: filters.distance,
    count: filters.aroundMeCount || 3
  };

  return (
    <div className="geosearch-integration" data-context={JSON.stringify(contextValue)}>
      {children}
    </div>
  );
};

export default GeoSearchIntegration;
