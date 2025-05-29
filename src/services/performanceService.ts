
interface PerformanceMetrics {
  searchTime: number;
  renderTime: number;
  apiCalls: number;
  cacheHits: number;
  cacheMisses: number;
}

class PerformanceService {
  private metrics: PerformanceMetrics = {
    searchTime: 0,
    renderTime: 0,
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0
  };

  // Mesurer le temps de recherche
  startSearchTimer(): () => void {
    const startTime = performance.now();
    return () => {
      this.metrics.searchTime = performance.now() - startTime;
      console.log(`Temps de recherche: ${this.metrics.searchTime.toFixed(2)}ms`);
    };
  }

  // Mesurer le temps de rendu
  startRenderTimer(): () => void {
    const startTime = performance.now();
    return () => {
      this.metrics.renderTime = performance.now() - startTime;
      console.log(`Temps de rendu: ${this.metrics.renderTime.toFixed(2)}ms`);
    };
  }

  // Incrémenter les compteurs
  incrementApiCalls(): void {
    this.metrics.apiCalls++;
  }

  incrementCacheHits(): void {
    this.metrics.cacheHits++;
  }

  incrementCacheMisses(): void {
    this.metrics.cacheMisses++;
  }

  // Obtenir les métriques
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Réinitialiser les métriques
  resetMetrics(): void {
    this.metrics = {
      searchTime: 0,
      renderTime: 0,
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0
    };
  }

  // Analyser les performances
  analyzePerformance(): string {
    const cacheEfficiency = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100;
    
    return `
Analyse de performance:
- Temps de recherche: ${this.metrics.searchTime.toFixed(2)}ms
- Temps de rendu: ${this.metrics.renderTime.toFixed(2)}ms
- Appels API: ${this.metrics.apiCalls}
- Efficacité du cache: ${cacheEfficiency.toFixed(1)}%
- Cache hits: ${this.metrics.cacheHits}
- Cache misses: ${this.metrics.cacheMisses}
    `.trim();
  }
}

export const performanceService = new PerformanceService();
