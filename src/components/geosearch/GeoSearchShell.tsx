
import { useEffect, useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { MapboxTokenWarning } from '@/components/MapboxTokenWarning';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useGeoSearchManager } from '@/hooks/geosearch/useGeoSearchManager';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const GeoSearchController = lazy(() => import('@/components/geosearch/GeoSearchController'));
const GeoSearchLayout = lazy(() => import('@/components/geosearch/GeoSearchLayout'));

const GeoSearchShell = () => {
  const { t } = useTranslation();
  const [showTokenWarning, setShowTokenWarning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const { filters, updateFilters, networkStatus } = useGeoSearchManager();

  // Synchronisation des filtres avec les paramètres URL
  useEffect(() => {
    try {
      const urlParams = Object.fromEntries(searchParams.entries());
      
      // Convertir les paramètres URL en filtres valides
      const filtersFromUrl = {
        ...urlParams,
        distance: urlParams.distance ? Number(urlParams.distance) : undefined,
        aroundMeCount: urlParams.aroundMeCount ? Number(urlParams.aroundMeCount) : undefined,
        showMultiDirections: urlParams.showMultiDirections === 'true',
      };

      // Mise à jour des filtres si des paramètres sont présents
      if (Object.keys(filtersFromUrl).length > 0) {
        updateFilters(filtersFromUrl);
      }
    } catch (err) {
      console.error('Erreur lors de la synchronisation des paramètres URL:', err);
    }
  }, [searchParams, updateFilters]);

  // Vérification du token Mapbox au montage
  useEffect(() => {
    const checkMapboxToken = async () => {
      try {
        setIsInitializing(true);
        setError(null);
        
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
        setError('Erreur de configuration Mapbox');
        setShowTokenWarning(true);
      } finally {
        setIsInitializing(false);
      }
    };

    checkMapboxToken();
  }, []);

  // Génération dynamique des métadonnées SEO
  const generateSEOTitle = () => {
    if (filters.category) {
      return `${filters.category} - ${t('geoSearch.title')} | LocaSimple`;
    }
    if (filters.query) {
      return `${filters.query} - ${t('geoSearch.title')} | LocaSimple`;
    }
    return `${t('geoSearch.defaultTitle')} | LocaSimple`;
  };

  const generateSEODescription = () => {
    if (filters.category) {
      return t('geoSearch.descriptionWithCategory', { category: filters.category });
    }
    if (filters.query) {
      return t('geoSearch.descriptionWithQuery', { query: filters.query });
    }
    return t('geoSearch.defaultDescription');
  };

  // Composant de chargement amélioré avec indicateur de réseau
  const EnhancedLoadingScreen = ({ message = t('geoSearch.loading') }: { message?: string }) => (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4"
      role="status" 
      aria-live="polite"
    >
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <LoadingSpinner size="lg" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-6">
          {message}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {t('geoSearch.preparingInterface')}
        </p>
        
        {/* Indicateur de statut réseau */}
        {networkStatus && networkStatus !== 'online' && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              networkStatus === 'offline' ? 'bg-red-500 animate-pulse' : 'bg-orange-500 animate-pulse'
            }`} />
            <span className={`text-sm ${
              networkStatus === 'offline' ? 'text-red-600' : 'text-orange-600'
            }`}>
              {networkStatus === 'offline' ? t('common.offline') : t('common.slowConnection')}
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
    setError(null);
    
    // Petit délai pour laisser le temps à l'interface de se mettre à jour
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Affichage des erreurs critiques
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-gray-100 px-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. {t('common.tryAgainLater')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={generateSEOTitle()} 
        description={generateSEODescription()}
        keywords="cartographie, france, recherche géographique, mapbox, géolocalisation, lieux"
      />
      
      <Suspense fallback={<EnhancedLoadingScreen message={t('geoSearch.loadingInterface')} />}>
        {isInitializing ? (
          <EnhancedLoadingScreen message={t('geoSearch.checkingConfiguration')} />
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

export default GeoSearchShell;
