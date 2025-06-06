
import React from 'react';
import GeoSearchController from '@/components/geosearch/GeoSearchController';
import GeoSearchLayout from '@/components/geosearch/GeoSearchLayout';
import SEOHead from '@/components/SEOHead';
import { MapboxTokenWarning } from '@/components/MapboxTokenWarning';
import { useTranslation } from 'react-i18next';
import { useGeoSearchManager } from '@/hooks/useGeoSearchManager';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';

const GeoSearch: React.FC = () => {
  const { t } = useTranslation();
  const [showTokenWarning, setShowTokenWarning] = React.useState(false);

  const { filters, statusInfo, isMapboxReady } = useGeoSearchManager();

  // Check Mapbox token on mount
  React.useEffect(() => {
    const checkToken = async () => {
      try {
        if (!isMapboxTokenValid()) {
          setShowTokenWarning(true);
        }
      } catch (error) {
        console.error('Erreur de vérification du token Mapbox:', error);
        setShowTokenWarning(true);
      }
    };

    checkToken();
  }, []);

  // Dynamic SEO based on current search context
  const seoTitle = React.useMemo(() => {
    if (filters.category) {
      return `${filters.category} - Recherche géographique | LocaSimple`;
    }
    if (filters.query) {
      return `${filters.query} - Recherche géographique | LocaSimple`;
    }
    return `Recherche géographique - Trouvez des lieux près de vous | LocaSimple`;
  }, [filters.category, filters.query]);
    
  const seoDescription = React.useMemo(() => {
    if (filters.category) {
      return `Trouvez les meilleurs ${filters.category} près de votre position. Recherche géographique intelligente avec itinéraires et informations détaillées.`;
    }
    return `Recherche géographique avancée pour trouver des lieux, services et points d'intérêt près de vous. Calcul d'itinéraires et géolocalisation précise.`;
  }, [filters.category]);

  // Show token warning if needed
  if (showTokenWarning) {
    return (
      <>
        <SEOHead title={seoTitle} description={seoDescription} />
        <MapboxTokenWarning onTokenUpdate={() => {
          setShowTokenWarning(false);
          window.location.reload();
        }} />
      </>
    );
  }

  // Show loading state while Mapbox initializes
  if (!isMapboxReady) {
    return (
      <>
        <SEOHead title={seoTitle} description={seoDescription} />
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
          <div className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Initialisation de la carte
            </h3>
            <p className="text-gray-600 text-sm">
              Chargement de la géolocalisation et des services...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} />
      
      <GeoSearchController>
        <GeoSearchLayout />
      </GeoSearchController>
    </>
  );
};

export default GeoSearch;
