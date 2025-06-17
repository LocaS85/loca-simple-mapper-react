
import React, { createContext, useContext } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { LocationData } from '@/types/geosearch';

interface SearchIntegrationContextType {
  onSearchSelect: (result: SearchSelectResult) => void;
  onDirectSearch: (query: string) => void;
}

interface SearchSelectResult {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  properties: Record<string, unknown>;
}

const SearchIntegrationContext = createContext<SearchIntegrationContextType>({
  onSearchSelect: () => {},
  onDirectSearch: () => {}
});

export const useSearchIntegrationContext = (): SearchIntegrationContextType => {
  return useContext(SearchIntegrationContext);
};

interface GeoSearchControllerProps {
  children: React.ReactNode;
}

const GeoSearchController: React.FC<GeoSearchControllerProps> = ({ children }) => {
  const { updateFilters, setIsLoading } = useGeoSearchStore();

  const handleSearchSelect = (result: SearchSelectResult): void => {
    const locationData: LocationData = {
      name: result.text,
      coordinates: result.center,
      placeName: result.place_name
    };

    updateFilters({ 
      query: result.text,
      selectedLocation: locationData
    });
  };

  const handleDirectSearch = (query: string): void => {
    updateFilters({ query });
    setIsLoading(true);
  };

  const contextValue: SearchIntegrationContextType = {
    onSearchSelect: handleSearchSelect,
    onDirectSearch: handleDirectSearch
  };

  return (
    <SearchIntegrationContext.Provider value={contextValue}>
      {children}
    </SearchIntegrationContext.Provider>
  );
};

export default GeoSearchController;
