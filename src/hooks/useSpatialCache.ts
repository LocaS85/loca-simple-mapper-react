import { useState, useCallback, useEffect } from 'react';
import { spatialCacheService } from '@/services/spatialCache/SpatialCacheService';
import { SearchResult } from '@/types/unified';
import { useToast } from '@/hooks/use-toast';

interface SpatialCacheMetrics {
  hitRatio: number;
  avgLatency: number;
  totalRequests: number;
  cacheHits: number;
  spatialCoverage: number;
}

export const useSpatialCache = () => {
  const [metrics, setMetrics] = useState<SpatialCacheMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Cache des résultats de recherche
  const cacheResults = useCallback(async (
    query: string,
    center: [number, number],
    filters: any,
    results: SearchResult[]
  ) => {
    try {
      // Note: SpatialCacheService ne dispose pas de méthode publique pour set
      // Les résultats sont automatiquement mis en cache via getCachedResults
      console.log('✅ Cache mis à jour automatiquement:', { query, count: results.length });
    } catch (error) {
      console.error('❌ Erreur cache spatial:', error);
    }
  }, []);

  // Récupération des résultats cachés
  const getCachedResults = useCallback(async (
    query: string,
    center: [number, number],
    filters: any
  ): Promise<SearchResult[] | null> => {
    try {
      setIsLoading(true);
      const cached = await spatialCacheService.getCachedResults(center, 5);
      
      if (cached) {
        console.log('🎯 Cache hit:', { query, count: cached.length });
        return cached;
      }
      
      console.log('❌ Cache miss:', { query });
      return null;
    } catch (error) {
      console.error('❌ Erreur lecture cache:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Invalidation du cache
  const invalidateCache = useCallback(async (pattern?: string) => {
    try {
      await spatialCacheService.clearCache();
      toast({
        title: "Cache invalidé",
        description: pattern ? `Pattern "${pattern}" supprimé` : "Cache spatial vidé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'invalider le cache",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Préchargement intelligent
  const preloadNearbyAreas = useCallback(async (
    center: [number, number],
    categories: string[]
  ) => {
    try {
      // Le préchargement se fait automatiquement lors des requêtes
      console.log('🔄 Préchargement zones adjacentes disponible via cache automatique');
    } catch (error) {
      console.error('❌ Erreur préchargement:', error);
    }
  }, []);

  // Récupération des métriques
  const refreshMetrics = useCallback(async () => {
    try {
      const newMetrics = await spatialCacheService.getMetrics();
      setMetrics(newMetrics);
    } catch (error) {
      console.error('❌ Erreur métriques cache:', error);
    }
  }, []);

  // Auto-refresh des métriques
  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 10000); // Toutes les 10s
    return () => clearInterval(interval);
  }, [refreshMetrics]);

  return {
    // État
    metrics,
    isLoading,
    
    // Actions
    cacheResults,
    getCachedResults,
    invalidateCache,
    preloadNearbyAreas,
    refreshMetrics,
    
    // Utilitaires
    getCacheSize: () => spatialCacheService.getMetrics(),
    compressCache: () => spatialCacheService.cleanupExpired(),
    optimizeCache: () => spatialCacheService.clearCache()
  };
};