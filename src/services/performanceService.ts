
interface PerformanceMetrics {
  apiCalls: number;
  cacheHits: number;
  cacheMisses: number;
  searchTimes: number[];
  avgSearchTime: number;
  totalErrors: number;
  pageLoadTime: number;
  navigationTiming: PerformanceNavigationTiming | null;
}

class PerformanceService {
  private metrics: PerformanceMetrics = {
    apiCalls: 0,
    cacheHits: 0,
    cacheMisses: 0,
    searchTimes: [],
    avgSearchTime: 0,
    totalErrors: 0,
    pageLoadTime: 0,
    navigationTiming: null
  };

  private timers: Map<string, number> = new Map();

  constructor() {
    this.initializePageMetrics();
  }

  // Initialiser les métriques de page avec correction
  private initializePageMetrics(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          // Correction: utiliser loadEventEnd - fetchStart au lieu de navigationStart
          this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          this.metrics.navigationTiming = navigation;
        }
      });
    }
  }

  // Démarrer un timer personnalisé
  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  // Arrêter un timer et retourner la durée
  endTimer(name: string): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      console.warn(`Timer "${name}" non trouvé`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.timers.delete(name);
    return duration;
  }

  // Démarrer un timer de recherche - retourne une fonction pour arrêter le timer
  startSearchTimer(): () => number {
    const timerId = `search-${Date.now()}`;
    this.startTimer(timerId);
    
    return () => {
      const duration = this.endTimer(timerId);
      this.metrics.searchTimes.push(duration);
      this.updateAvgSearchTime();
      return duration;
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

  // Analyser les performances avec plus de détails
  analyzePerformance(): PerformanceMetrics & {
    cacheHitRate: number;
    performanceScore: number;
    recommendations: string[];
  } {
    const cacheHitRate = this.getCacheHitRate();
    const performanceScore = this.calculatePerformanceScore();
    const recommendations = this.getRecommendations();

    return { 
      ...this.metrics, 
      cacheHitRate,
      performanceScore,
      recommendations
    };
  }

  // Calculer un score de performance global
  private calculatePerformanceScore(): number {
    let score = 100;
    
    // Pénaliser les temps de recherche lents
    if (this.metrics.avgSearchTime > 2000) score -= 20;
    else if (this.metrics.avgSearchTime > 1000) score -= 10;
    
    // Pénaliser un faible taux de cache
    const cacheRate = this.getCacheHitRate();
    if (cacheRate < 50) score -= 15;
    else if (cacheRate < 75) score -= 5;
    
    // Pénaliser les erreurs
    if (this.metrics.totalErrors > 10) score -= 25;
    else if (this.metrics.totalErrors > 5) score -= 10;
    
    return Math.max(0, score);
  }

  // Obtenir des recommandations d'optimisation
  private getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.avgSearchTime > 1000) {
      recommendations.push('Optimiser les temps de recherche');
    }
    
    if (this.getCacheHitRate() < 75) {
      recommendations.push('Améliorer la stratégie de cache');
    }
    
    if (this.metrics.totalErrors > 5) {
      recommendations.push('Réduire le nombre d\'erreurs');
    }
    
    if (this.metrics.pageLoadTime > 3000) {
      recommendations.push('Optimiser le temps de chargement');
    }
    
    return recommendations;
  }

  // Réinitialiser les métriques
  resetMetrics(): void {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      searchTimes: [],
      avgSearchTime: 0,
      totalErrors: 0,
      pageLoadTime: this.metrics.pageLoadTime, // Garder le temps de chargement initial
      navigationTiming: this.metrics.navigationTiming
    };
  }

  // Obtenir le taux de succès du cache
  getCacheHitRate(): number {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? (this.metrics.cacheHits / total) * 100 : 0;
  }

  // Obtenir les métriques Web Vitals si disponibles
  getWebVitals(): Promise<any> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') {
        resolve({});
        return;
      }

      try {
        import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
          const vitals: any = {};
          
          onCLS((metric) => vitals.cls = metric);
          onFCP((metric) => vitals.fcp = metric);
          onLCP((metric) => vitals.lcp = metric);
          onTTFB((metric) => vitals.ttfb = metric);
          if (onINP) onINP((metric) => vitals.inp = metric);
          
          setTimeout(() => resolve(vitals), 1000);
        }).catch(() => resolve({}));
      } catch (error) {
        resolve({});
      }
    });
  }
}

export const performanceService = new PerformanceService();
