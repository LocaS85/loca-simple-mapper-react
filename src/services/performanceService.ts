
interface PerformanceMetrics {
  searchTime: number;
  renderTime: number;
  apiCalls: number;
  cacheHits: number;
  cacheMisses: number;
  lastSearchTimestamp: number;
  totalSearches: number;
}

interface SearchPerformanceData {
  query: string;
  duration: number;
  resultCount: number;
  cacheUsed: boolean;
  timestamp: number;
}

class PerformanceService {
  private metrics: PerformanceMetrics = {
    searchTime: 0,
    renderTime: 0,
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0,
    lastSearchTimestamp: 0,
    totalSearches: 0
  };

  private searchHistory: SearchPerformanceData[] = [];
  private readonly MAX_HISTORY_SIZE = 100;

  // Mesurer le temps de recherche avec contexte
  startSearchTimer(query: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.metrics.searchTime = duration;
      this.metrics.lastSearchTimestamp = Date.now();
      this.metrics.totalSearches++;
      
      console.log(`Temps de recherche pour "${query}": ${duration.toFixed(2)}ms`);
      
      // Ajouter à l'historique
      this.addToSearchHistory({
        query,
        duration,
        resultCount: 0, // sera mis à jour après
        cacheUsed: false,
        timestamp: Date.now()
      });
    };
  }

  // Mesurer le temps de rendu
  startRenderTimer(component: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.metrics.renderTime = duration;
      console.log(`Temps de rendu ${component}: ${duration.toFixed(2)}ms`);
    };
  }

  // Ajouter des données de recherche à l'historique
  addToSearchHistory(data: SearchPerformanceData): void {
    this.searchHistory.unshift(data);
    if (this.searchHistory.length > this.MAX_HISTORY_SIZE) {
      this.searchHistory = this.searchHistory.slice(0, this.MAX_HISTORY_SIZE);
    }
  }

  // Mettre à jour les résultats de la dernière recherche
  updateLastSearchResults(resultCount: number, cacheUsed: boolean): void {
    if (this.searchHistory.length > 0) {
      this.searchHistory[0].resultCount = resultCount;
      this.searchHistory[0].cacheUsed = cacheUsed;
    }
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

  // Obtenir les métriques avec calculs supplémentaires
  getMetrics(): PerformanceMetrics & { 
    averageSearchTime: number;
    cacheEfficiency: number;
    searchesPerMinute: number;
  } {
    const averageSearchTime = this.searchHistory.length > 0
      ? this.searchHistory.reduce((sum, search) => sum + search.duration, 0) / this.searchHistory.length
      : 0;

    const cacheEfficiency = this.metrics.cacheHits + this.metrics.cacheMisses > 0
      ? (this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses)) * 100
      : 0;

    // Calcul des recherches par minute sur les 5 dernières minutes
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    const recentSearches = this.searchHistory.filter(search => search.timestamp > fiveMinutesAgo);
    const searchesPerMinute = recentSearches.length / 5;

    return {
      ...this.metrics,
      averageSearchTime,
      cacheEfficiency,
      searchesPerMinute
    };
  }

  // Obtenir l'historique des recherches
  getSearchHistory(): SearchPerformanceData[] {
    return [...this.searchHistory];
  }

  // Réinitialiser les métriques
  resetMetrics(): void {
    this.metrics = {
      searchTime: 0,
      renderTime: 0,
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      lastSearchTimestamp: 0,
      totalSearches: 0
    };
    this.searchHistory = [];
  }

  // Analyser les performances avec recommandations
  analyzePerformance(): {
    summary: string;
    recommendations: string[];
    metrics: ReturnType<typeof this.getMetrics>;
  } {
    const metrics = this.getMetrics();
    const recommendations: string[] = [];

    // Recommandations basées sur les métriques
    if (metrics.averageSearchTime > 2000) {
      recommendations.push('Temps de recherche élevé - considérer l\'optimisation des requêtes API');
    }

    if (metrics.cacheEfficiency < 50) {
      recommendations.push('Efficacité du cache faible - réviser la stratégie de mise en cache');
    }

    if (metrics.renderTime > 1000) {
      recommendations.push('Temps de rendu élevé - optimiser les composants React');
    }

    if (metrics.searchesPerMinute > 20) {
      recommendations.push('Taux de recherche élevé - implémenter un debouncing plus agressif');
    }

    const summary = `
Analyse de performance:
- Temps de recherche moyen: ${metrics.averageSearchTime.toFixed(2)}ms
- Temps de rendu: ${metrics.renderTime.toFixed(2)}ms
- Appels API: ${metrics.apiCalls}
- Efficacité du cache: ${metrics.cacheEfficiency.toFixed(1)}%
- Recherches totales: ${metrics.totalSearches}
- Recherches/minute: ${metrics.searchesPerMinute.toFixed(1)}
    `.trim();

    return {
      summary,
      recommendations,
      metrics
    };
  }

  // Exporter les métriques pour l'analyse
  exportMetrics(): string {
    const analysis = this.analyzePerformance();
    return JSON.stringify(analysis, null, 2);
  }
}

export const performanceService = new PerformanceService();
