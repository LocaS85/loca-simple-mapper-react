
import { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHead from '@/components/SEOHead';
import { MapboxTokenWarning } from '@/components/MapboxTokenWarning';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { useGeoSearchManager } from '@/hooks/geosearch/useGeoSearchManager';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// Lazy load components pour améliorer les performances
const GeoSearchController = lazy(() => import('@/components/geosearch/GeoSearchController'));
const GeoSearchLayout = lazy(() => import('@/components/geosearch/GeoSearchLayout'));

const GeoSearch = () => {
  const { t } = useTranslation();
  const [showTokenWarning, setShowTokenWarning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { filters, isMapboxReady, networkStatus } = useGeoSearchManager();

  // Vérification du token Mapbox au montage
  useEffect(() => {
    const checkMapboxToken = async () => {
      try {
        setIsInitializing(true);
        
        // Vérifier la validité du token
        const tokenValid = isMapboxTokenValid();
        
        if (!tokenValid) {
          console.warn('⚠️ Token Mapbox non valide ou manquant');
          setShowTokenWarning(true);
        } else {
          console.log('✅ Token Mapbox valide');
          setShowTokenWarning(false);
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification du token Mapbox:', error);
        setShowTokenWarning(true);
      } finally {
        setIsInitializing(false);
      }
    };

    checkMapboxToken();
  }, []);

  // SEO dynamique basé sur le contexte de recherche
  const seoTitle = (() => {
    if (filters.category) {
      return `${filters.category} - Recherche géographique | LocaSimple`;
    }
    if (filters.query) {
      return `${filters.query} - Recherche géographique | LocaSimple`;
    }
    return 'Recherche géographique - Trouvez des lieux près de vous | LocaSimple';
  })();

  const seoDescription = (() => {
    if (filters.category) {
      return `Trouvez les meilleurs ${filters.category} près de votre position. Recherche géographique intelligente avec itinéraires et informations détaillées.`;
    }
    return 'Recherche géographique avancée pour trouver des lieux, services et points d\'intérêt près de vous. Calcul d\'itinéraires et géolocalisation précise.';
  })();

  // Composant de chargement amélioré
  const LoadingScreen = ({ message = "Initialisation..." }: { message?: string }) => (
    <div 
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4"
      role="status" 
      aria-live="polite"
    >
      <div className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <LoadingSpinner size="lg" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
          {message}
        </h3>
        <p className="text-gray-600 text-sm">
          Préparation de la recherche géographique...
        </p>
        {networkStatus && networkStatus !== 'online' && (
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              networkStatus === 'offline' ? 'bg-red-500' : 'bg-orange-500'
            }`} />
            <span className={`text-xs ${
              networkStatus === 'offline' ? 'text-red-600' : 'text-orange-600'
            }`}>
              {networkStatus === 'offline' ? 'Hors ligne' : 'Connexion lente'}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Gestion des erreurs de token
  const handleTokenUpdate = (newToken: string) => {
    console.log('🔄 Mise à jour du token Mapbox');
    setShowTokenWarning(false);
    // Recharger la page pour appliquer le nouveau token
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <SEOHead 
        title={seoTitle} 
        description={seoDescription}
        keywords="cartographie, france, recherche géographique, mapbox, géolocalisation"
      />
      
      <Suspense fallback={<LoadingScreen message="Chargement de l'interface..." />}>
        {isInitializing ? (
          <LoadingScreen message="Vérification de la configuration..." />
        ) : showTokenWarning ? (
          <MapboxTokenWarning onTokenUpdate={handleTokenUpdate} />
        ) : (
          <GeoSearchController>
            <GeoSearchLayout />
          </GeoSearchController>
        )}
      </Suspense>
    </>
  );
};

export default GeoSearch;
