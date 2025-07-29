interface RouteData {
  geometry: any;
  duration: number;
  distance: number;
  timestamp: number;
  expiry: number;
}

interface CachedRoute {
  route: RouteData;
  timestamp: number;
  expiry: number;
}

export class RouteCache {
  private cache = new Map<string, CachedRoute>();
  private readonly BASE_TTL = 10 * 60 * 1000; // 10 minutes base
  private readonly MAX_TTL = 60 * 60 * 1000; // 1 hour max

  private generateKey(origin: [number, number], destination: [number, number], transport: string): string {
    return `${origin[0].toFixed(4)},${origin[1].toFixed(4)}-${destination[0].toFixed(4)},${destination[1].toFixed(4)}-${transport}`;
  }

  private calculateTTL(distance: number): number {
    // Routes courtes = cache plus long (moins susceptibles de changer)
    // Routes longues = cache plus court (plus de variations possibles)
    const distanceKm = distance / 1000;
    
    if (distanceKm < 5) {
      return this.MAX_TTL; // 1 heure pour courtes distances
    } else if (distanceKm < 20) {
      return this.BASE_TTL * 3; // 30 minutes pour distances moyennes
    } else {
      return this.BASE_TTL; // 10 minutes pour longues distances
    }
  }

  set(origin: [number, number], destination: [number, number], transport: string, routeData: RouteData): void {
    const key = this.generateKey(origin, destination, transport);
    const ttl = this.calculateTTL(routeData.distance);
    const now = Date.now();

    this.cache.set(key, {
      route: routeData,
      timestamp: now,
      expiry: now + ttl
    });
  }

  get(origin: [number, number], destination: [number, number], transport: string): RouteData | null {
    const key = this.generateKey(origin, destination, transport);
    const cached = this.cache.get(key);
    
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.route;
  }

  clear(): void {
    this.cache.clear();
  }

  cleanExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiry) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; hitRate: number } {
    // Simple stats pour monitoring
    return {
      size: this.cache.size,
      hitRate: 0 // À implémenter si nécessaire
    };
  }
}

export const routeCache = new RouteCache();