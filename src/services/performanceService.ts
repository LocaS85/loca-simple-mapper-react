
interface PerformanceMetrics {
  apiCalls: number;
  cacheHits: number;
  cacheMisses: number;
  searchTimes: number[];
  avgSearchTime: number;
  totalErrors: number;
}

class PerformanceService {
  private metrics: PerformanceMetrics = {
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0,
    searchTimes: [],
    avgSearchTime: 0,
    totalErrors: 0
  };

  // Démarrer un timer de recherche - retourne une fonction pour arrêter le timer
  startSearchTimer(): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.metrics.searchTimes.push(duration);
      this.updateAvgSearchTime();
    };
  }

  // Incrémenter les appels API
  incrementApiCalls(): void {
    this.metrics.apiCalls++;
  }

  // Incrémenter les hits de cache
  incrementCacheHits(): void {
    this.metrics.cacheHits++;
  }

  // Incrémenter les misses de cache
  incrementCacheMisses(): void {
    this.metrics.cacheMisses++;
  }

  // Incrémenter les erreurs
  incrementErrors(): void {
    this.metrics.totalErrors++;
  }

  // Calculer le temps moyen de recherche
  private updateAvgSearchTime(): void {
    const times = this.metrics.searchTimes;
    if (times.length > 0) {
      this.metrics.avgSearchTime = times.reduce((a, b) => a + b, 0) / times.length;
    }
  }

  // Analyser les performances
  analyzePerformance(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Réinitialiser les métriques
  resetMetrics(): void {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      searchTimes: [],
      avgSearchTime: 0,
      totalErrors: 0
    };
  }

  // Obtenir le taux de succès du cache
  getCacheHitRate(): number {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? (this.metrics.cacheHits / total) * 100 : 0;
  }
}

export const performanceService = new PerformanceService();
