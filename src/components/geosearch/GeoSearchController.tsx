
import React from 'react';
import { useGeoSearchManager } from '@/hooks/geosearch/useGeoSearchManager';
import GeoSearchLayout from './GeoSearchLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const GeoSearchController: React.FC = () => {
  const {
    isMapboxReady,
    networkStatus
  } = useGeoSearchManager();

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

  if (networkStatus === 'offline') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Connexion réseau requise pour utiliser GeoSearch.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <GeoSearchLayout />;
};

export default GeoSearchController;
