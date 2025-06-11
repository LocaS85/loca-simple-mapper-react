
import React from 'react';
import { useGeoSearchCoordination } from '@/hooks/useGeoSearchCoordination';
import { useSearchIntegration } from '@/hooks/geosearch/useSearchIntegration';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface GeoSearchControllerProps {
  children: React.ReactNode;
}

const GeoSearchController: React.FC<GeoSearchControllerProps> = ({ children }) => {
  const {
    isMapboxReady,
    networkStatus,
    statusInfo
  } = useGeoSearchCoordination();

  const {
    onSearchSelect,
    onDirectSearch,
    onLocationChange
  } = useSearchIntegration();

  // Provide search integration context to children
  const contextValue = {
    onSearchSelect,
    onDirectSearch,
    onLocationChange,
    isReady: statusInfo.isReady
  };

  // Show loading state while initializing
  if (!isMapboxReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <LoadingSpinner />
          <p className="mt-4 text-lg font-medium text-gray-700">
            Initialisation de la recherche géographique...
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {networkStatus === 'offline' ? (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-600">Hors ligne</span>
              </>
            ) : networkStatus === 'slow' ? (
              <>
                <Wifi className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-orange-600">Connexion lente</span>
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">En ligne</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show network error
  if (networkStatus === 'offline') {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-gray-100">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connexion internet requise pour la recherche géographique.
            Veuillez vérifier votre connexion et réessayer.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="geo-search-controller" data-ready={statusInfo.isReady}>
      <SearchIntegrationProvider value={contextValue}>
        {children}
      </SearchIntegrationProvider>
    </div>
  );
};

// Context for search integration
const SearchIntegrationContext = React.createContext<any>(null);

const SearchIntegrationProvider: React.FC<{ value: any; children: React.ReactNode }> = ({ 
  value, 
  children 
}) => (
  <SearchIntegrationContext.Provider value={value}>
    {children}
  </SearchIntegrationContext.Provider>
);

export const useSearchIntegrationContext = () => {
  const context = React.useContext(SearchIntegrationContext);
  if (!context) {
    throw new Error('useSearchIntegrationContext must be used within SearchIntegrationProvider');
  }
  return context;
};

export default GeoSearchController;
