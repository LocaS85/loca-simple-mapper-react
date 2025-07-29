interface NetworkInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

export class RouteOptimizer {
  private readonly MAX_ROUTES = 5;
  private readonly DEFAULT_ROUTES = 3;
  private readonly MIN_ROUTES = 1;

  getOptimalRouteCount(resultsCount: number): number {
    const networkSpeed = this.getNetworkSpeed();
    const devicePerformance = this.getDevicePerformance();
    
    let optimalCount = this.DEFAULT_ROUTES;

    // Ajustement selon la vitesse réseau
    switch (networkSpeed) {
      case 'fast':
        optimalCount = Math.min(this.MAX_ROUTES, resultsCount);
        break;
      case 'slow':
        optimalCount = this.MIN_ROUTES;
        break;
      case 'medium':
      default:
        optimalCount = Math.min(this.DEFAULT_ROUTES, resultsCount);
        break;
    }

    // Ajustement selon les performances du dispositif
    if (devicePerformance === 'low') {
      optimalCount = Math.max(this.MIN_ROUTES, optimalCount - 1);
    }

    // Limiter selon le nombre de résultats disponibles
    return Math.min(optimalCount, resultsCount);
  }

  private getNetworkSpeed(): 'fast' | 'medium' | 'slow' {
    // Utiliser l'API Network Information si disponible
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      const effectiveType = connection.effectiveType;
      
      switch (effectiveType) {
        case '4g':
          return connection.downlink > 5 ? 'fast' : 'medium';
        case '3g':
          return 'medium';
        case '2g':
        case 'slow-2g':
          return 'slow';
        default:
          return 'medium';
      }
    }

    // Fallback: tester la vitesse avec performance.timing
    if (typeof performance !== 'undefined' && performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.fetchStart;
      
      if (loadTime < 1000) return 'fast';
      if (loadTime > 3000) return 'slow';
      return 'medium';
    }

    return 'medium';
  }

  private getDevicePerformance(): 'high' | 'medium' | 'low' {
    // Estimation basée sur les cores du CPU et la mémoire
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const deviceMemory = (navigator as any).deviceMemory || 4;

    if (hardwareConcurrency >= 8 && deviceMemory >= 8) {
      return 'high';
    }
    
    if (hardwareConcurrency >= 4 && deviceMemory >= 4) {
      return 'medium';
    }
    
    return 'low';
  }

  shouldLimitConcurrentRequests(): boolean {
    const networkSpeed = this.getNetworkSpeed();
    const devicePerformance = this.getDevicePerformance();
    
    return networkSpeed === 'slow' || devicePerformance === 'low';
  }

  getRequestDelay(): number {
    const networkSpeed = this.getNetworkSpeed();
    
    switch (networkSpeed) {
      case 'slow':
        return 500; // 500ms entre les requêtes
      case 'medium':
        return 200; // 200ms entre les requêtes
      case 'fast':
      default:
        return 0; // Pas de délai
    }
  }
}

export const routeOptimizer = new RouteOptimizer();