
import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import { MapboxTokenWarning } from '@/components/MapboxTokenWarning';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { useGeoSearchManager } from '@/hooks/geosearch/useGeoSearchManager';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// Lazy load components for better performance
const GeoSearchController = React.lazy(() => import('@/components/geosearch/GeoSearchController'));
const GeoSearchLayout = React.lazy(() => import('@/components/geosearch/GeoSearchLayout'));

const GeoSearch: React.FC = () => {
  const { t } = useTranslation();
  const [showTokenWarning, setShowTokenWarning] = React.useState(false);
  const [isChecking, setIsChecking] = React.useState(true);

  const { filters } = useGeoSearchManager();

  // Check Mapbox token on mount
  React.useEffect(() => {
    const checkToken = async () => {
      try {
        setIsChecking(true);
        if (!isMapboxTokenValid()) {
          console.warn('Token Mapbox non valide');
          setShowTokenWarning(true);
        }
      } catch (error) {
        console.error('Erreur de vérification du token Mapbox:', error);
        setShowTokenWarning(true);
      } finally {
        setIsChecking(false);
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

  // Enhanced loading component
  const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <LoadingSpinner />
        <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
          Vérification de la configuration
        </h3>
        <p className="text-gray-600 text-sm">
          Préparation des services de géolocalisation...
        </p>
      </div>
    </div>
  );

  // Show loading while checking token
  if (isChecking) {
    return (
      <>
        <SEOHead title={seoTitle} description={seoDescription} />
        <LoadingScreen />
      </>
    );
  }

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

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} />
      
      <Suspense fallback={<LoadingScreen />}>
        <GeoSearchController>
          <GeoSearchLayout />
        </GeoSearchController>
      </Suspense>
    </>
  );
};

export default GeoSearch;
