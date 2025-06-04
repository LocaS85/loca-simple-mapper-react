
import React from 'react';
import { Loader2, MapPin, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MapStatusIndicatorProps {
  resultsCount: number;
  isLoading: boolean;
  error?: string | null;
  networkStatus?: 'online' | 'offline' | 'slow';
}

const MapStatusIndicator: React.FC<MapStatusIndicatorProps> = ({
  resultsCount,
  isLoading,
  error,
  networkStatus
}) => {
  const { t } = useTranslation();

  if (error) {
    return (
      <div className="absolute bottom-4 left-4 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 z-20">
        <AlertCircle className="h-4 w-4" />
        <span>{error}</span>
      </div>
    );
  }

  if (networkStatus === 'offline') {
    return (
      <div className="absolute bottom-4 left-4 bg-orange-100 border border-orange-300 text-orange-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 z-20">
        <AlertCircle className="h-4 w-4" />
        <span>Mode hors-ligne</span>
      </div>
    );
  }

  if (networkStatus === 'slow') {
    return (
      <div className="absolute bottom-4 left-4 bg-yellow-100 border border-yellow-300 text-yellow-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 z-20">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Connexion lente...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute bottom-4 left-4 bg-blue-100 border border-blue-300 text-blue-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 z-20">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Recherche en cours...</span>
      </div>
    );
  }

  if (resultsCount > 0) {
    return (
      <div className="absolute bottom-4 left-4 bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2 z-20">
        <MapPin className="h-4 w-4" />
        <span>{resultsCount} résultat{resultsCount > 1 ? 's' : ''} trouvé{resultsCount > 1 ? 's' : ''}</span>
      </div>
    );
  }

  return null;
};

export default MapStatusIndicator;
