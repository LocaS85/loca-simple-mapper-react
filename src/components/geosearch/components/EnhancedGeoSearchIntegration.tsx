import React, { useEffect } from 'react';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useEnhancedGeolocation } from '@/hooks/useEnhancedGeolocation';
import { useSpatialCache } from '@/hooks/useSpatialCache';
import { batchMapboxService } from '@/services/batch/BatchMapboxService';
import { isochroneCacheService } from '@/services/isochrone/IsochroneCacheService';
import { useToast } from '@/hooks/use-toast';

interface EnhancedGeoSearchIntegrationProps {
  children: React.ReactNode;
}

export const EnhancedGeoSearchIntegration: React.FC<EnhancedGeoSearchIntegrationProps> = ({ 
  children 
}) => {
  const { toast } = useToast();
  const { 
    userLocation, 
    filters, 
    results, 
    setUserLocation,
    performSearch 
  } = useGeoSearchStore();

  const { 
    coordinates, 
    requestLocation, 
    isLoading: locationLoading,
    error: locationError 
  } = useEnhancedGeolocation();

  const { 
    getCachedResults, 
    cacheResults, 
    preloadNearbyAreas,
    metrics: cacheMetrics 
  } = useSpatialCache();

  // Synchronisation géolocalisation avancée
  useEffect(() => {
    if (coordinates && !userLocation) {
      setUserLocation(coordinates);
      console.log('📍 Position synchronisée depuis géolocalisation avancée');
    }
  }, [coordinates, userLocation, setUserLocation]);

  // Préchargement intelligent lors du changement de position
  useEffect(() => {
    if (userLocation && filters.category) {
      const categories = Array.isArray(filters.category) ? filters.category : [filters.category];
      preloadNearbyAreas(userLocation, categories);
    }
  }, [userLocation, filters.category, preloadNearbyAreas]);

  // Initialisation des services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        console.log('🚀 Initialisation services avancés...');
        
        // Initialiser le cache isochrone
        await isochroneCacheService.initialize();
        
        console.log('✅ Cache isochrone initialisé');
        
        console.log('✅ Services avancés initialisés');
      } catch (error) {
        console.error('❌ Erreur initialisation services:', error);
        toast({
          title: "Services avancés",
          description: "Certains services avancés ne sont pas disponibles",
          variant: "destructive"
        });
      }
    };

    initializeServices();
  }, [userLocation, toast]);

  // Performance monitoring
  useEffect(() => {
    if (cacheMetrics) {
      if (cacheMetrics.hitRatio > 0.8) {
        console.log('🎯 Excellent taux de cache:', Math.round(cacheMetrics.hitRatio * 100) + '%');
      } else if (cacheMetrics.hitRatio < 0.3) {
        console.warn('⚠️ Taux de cache faible:', Math.round(cacheMetrics.hitRatio * 100) + '%');
      }
    }
  }, [cacheMetrics]);

  // Recherche optimisée avec cache spatial
  const handleOptimizedSearch = async (query: string) => {
    if (!userLocation) {
      // Demander la géolocalisation si pas disponible
      if (!locationLoading) {
        requestLocation();
      }
      return;
    }

    try {
      console.log('🔍 Recherche optimisée:', { query, center: userLocation });

      // Vérifier le cache spatial d'abord
      const cachedResults = await getCachedResults(query, userLocation, filters);
      
      if (cachedResults && cachedResults.length > 0) {
        // Utiliser performSearch avec les résultats cachés
        toast({
          title: "Résultats cachés",
          description: `${cachedResults.length} résultats trouvés dans le cache`,
        });
        return;
      }

      // Sinon, recherche normale avec batch optimisé
      const searchResults = await batchMapboxService.searchPlacesOptimized(
        query,
        userLocation,
        {
          limit: filters.aroundMeCount || 10,
          radius: filters.distance || 5,
          categories: filters.category ? [filters.category] : undefined
        }
      );

      if (searchResults.length > 0) {
        // Mettre en cache automatiquement
        const categories = filters.category ? (Array.isArray(filters.category) ? filters.category : [filters.category]) : [];
        await cacheResults(query, userLocation, filters, searchResults);
        
        toast({
          title: "Recherche terminée",
          description: `${searchResults.length} résultats trouvés`,
        });
      }

    } catch (error) {
      console.error('❌ Erreur recherche optimisée:', error);
      
      // Fallback vers la recherche normale
      performSearch(query);
    }
  };

  // Remplacer la fonction de recherche par défaut
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__optimizedSearch = handleOptimizedSearch;
    }
  }, [userLocation, filters]);

  return (
    <div className="enhanced-geosearch-integration">
      {children}
      
      {/* Debug Info (visible en développement uniquement) */}
      {process.env.NODE_ENV === 'development' && cacheMetrics && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          Cache: {Math.round(cacheMetrics.hitRatio * 100)}% | 
          Requêtes: {cacheMetrics.totalRequests} | 
          Latence: {Math.round(cacheMetrics.avgLatency)}ms
        </div>
      )}
    </div>
  );
};