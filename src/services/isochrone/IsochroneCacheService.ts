import { TransportMode, CoordinatesPair } from '@/types/unified';
import { secureMapboxService } from '@/services/secureMapboxService';

interface IsochroneData {
  id: string;
  center: CoordinatesPair;
  duration: number;
  transportMode: TransportMode;
  polygon: GeoJSON.Feature<GeoJSON.Polygon>;
  timestamp: number;
  ttl: number;
  quality: 'high' | 'medium' | 'low';
  simplified?: GeoJSON.Feature<GeoJSON.Polygon>; // Douglas-Peucker simplified
}

interface PrecomputeArea {
  bbox: [number, number, number, number];
  durations: number[];
  transportModes: TransportMode[];
  priority: number;
  lastComputed: number;
}

interface CacheMetrics {
  hitRatio: number;
  totalRequests: number;
  cacheHits: number;
  precomputedHits: number;
  interpolatedResults: number;
  averageResponseTime: number;
}

export class IsochroneCacheService {
  private static instance: IsochroneCacheService;
  private memoryCache = new Map<string, IsochroneData>();
  private dbName = 'isochrone-cache-db';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private precomputeAreas: PrecomputeArea[] = [];
  private isPrecomputing = false;
  private metrics: CacheMetrics = {
    hitRatio: 0,
    totalRequests: 0,
    cacheHits: 0,
    precomputedHits: 0,
    interpolatedResults: 0,
    averageResponseTime: 0
  };

  // Popular areas for precomputation (French cities)
  private popularAreas: PrecomputeArea[] = [
    {
      bbox: [2.224, 48.815, 2.4697, 48.902], // Paris
      durations: [5, 10, 15, 30],
      transportModes: ['walking', 'cycling', 'driving'],
      priority: 10,
      lastComputed: 0
    },
    {
      bbox: [4.7844, 45.7578, 4.8525, 45.7797], // Lyon
      durations: [10, 15, 30],
      transportModes: ['walking', 'driving'],
      priority: 8,
      lastComputed: 0
    },
    {
      bbox: [5.3347, 43.2961, 5.4077, 43.3145], // Marseille
      durations: [10, 15, 30],
      transportModes: ['walking', 'driving'],
      priority: 7,
      lastComputed: 0
    }
  ];

  static getInstance(): IsochroneCacheService {
    if (!IsochroneCacheService.instance) {
      IsochroneCacheService.instance = new IsochroneCacheService();
    }
    return IsochroneCacheService.instance;
  }

  async initialize(): Promise<void> {
    await this.initializeIndexedDB();
    this.precomputeAreas = [...this.popularAreas];
    this.startBackgroundPrecomputation();
    console.log('✅ IsochroneCacheService initialized');
  }

  private async initializeIndexedDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('isochrones')) {
          const store = db.createObjectStore('isochrones', { keyPath: 'id' });
          store.createIndex('center', 'center');
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('transportMode', 'transportMode');
          store.createIndex('duration', 'duration');
        }
      };
    });
  }

  async getIsochrone(
    center: CoordinatesPair,
    duration: number,
    transportMode: TransportMode,
    useSimplified: boolean = false
  ): Promise<GeoJSON.Feature<GeoJSON.Polygon> | null> {
    const startTime = performance.now();
    this.metrics.totalRequests++;

    try {
      const cacheKey = this.generateCacheKey(center, duration, transportMode);
      
      // Check memory cache first
      let cached = this.memoryCache.get(cacheKey);
      
      // Check IndexedDB if not in memory
      if (!cached) {
        cached = await this.getFromIndexedDB(cacheKey);
        if (cached) {
          this.memoryCache.set(cacheKey, cached);
        }
      }

      if (cached && !this.isExpired(cached)) {
        this.metrics.cacheHits++;
        this.updateAverageResponseTime(performance.now() - startTime);
        
        console.log(`🎯 Isochrone cache HIT: ${cacheKey}`);
        return useSimplified && cached.simplified ? cached.simplified : cached.polygon;
      }

      // Try interpolation from nearby cached isochrones
      const interpolated = await this.tryInterpolation(center, duration, transportMode);
      if (interpolated) {
        this.metrics.interpolatedResults++;
        this.updateAverageResponseTime(performance.now() - startTime);
        
        console.log(`🧮 Isochrone interpolated: ${cacheKey}`);
        return interpolated;
      }

      // Fetch from API
      console.log(`🌐 Fetching isochrone from API: ${cacheKey}`);
      const polygon = await secureMapboxService.createIsochrone(center, duration, transportMode);
      
      if (polygon) {
        await this.cacheIsochrone(center, duration, transportMode, polygon);
        this.updateAverageResponseTime(performance.now() - startTime);
        return polygon;
      }

      return null;

    } catch (error) {
      console.error('❌ Isochrone cache error:', error);
      return null;
    }
  }

  private async cacheIsochrone(
    center: CoordinatesPair,
    duration: number,
    transportMode: TransportMode,
    polygon: GeoJSON.Feature<GeoJSON.Polygon>
  ): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(center, duration, transportMode);
      
      // Simplify polygon for faster rendering
      const simplified = this.simplifyPolygon(polygon);
      
      const isochroneData: IsochroneData = {
        id: cacheKey,
        center,
        duration,
        transportMode,
        polygon,
        simplified,
        timestamp: Date.now(),
        ttl: this.getTTL(duration, transportMode),
        quality: this.assessQuality(polygon)
      };

      // Store in memory and IndexedDB
      this.memoryCache.set(cacheKey, isochroneData);
      await this.saveToIndexedDB(isochroneData);
      
      console.log(`💾 Isochrone cached: ${cacheKey}`);
      
    } catch (error) {
      console.error('❌ Error caching isochrone:', error);
    }
  }

  private generateCacheKey(center: CoordinatesPair, duration: number, transportMode: TransportMode): string {
    const [lng, lat] = center;
    const roundedLng = Math.round(lng * 1000) / 1000; // 3 decimal places
    const roundedLat = Math.round(lat * 1000) / 1000;
    return `${roundedLng}_${roundedLat}_${duration}_${transportMode}`;
  }

  private getTTL(duration: number, transportMode: TransportMode): number {
    // Longer durations and walking/cycling have longer TTL (more stable)
    const baseTTL = 24 * 60 * 60 * 1000; // 24 hours
    
    const durationMultiplier = Math.min(duration / 60, 2); // Max 2x for 1 hour+
    const transportMultiplier = transportMode === 'driving' ? 0.5 : 1; // Driving changes more frequently
    
    return baseTTL * durationMultiplier * transportMultiplier;
  }

  private assessQuality(polygon: GeoJSON.Feature<GeoJSON.Polygon>): 'high' | 'medium' | 'low' {
    const coordinates = polygon.geometry.coordinates[0];
    const pointCount = coordinates.length;
    
    if (pointCount > 100) return 'high';
    if (pointCount > 50) return 'medium';
    return 'low';
  }

  private simplifyPolygon(polygon: GeoJSON.Feature<GeoJSON.Polygon>): GeoJSON.Feature<GeoJSON.Polygon> {
    // Douglas-Peucker simplification
    const originalCoords = polygon.geometry.coordinates[0];
    const simplified = this.douglasPeucker(originalCoords, 0.001); // ~100m tolerance
    
    return {
      ...polygon,
      geometry: {
        ...polygon.geometry,
        coordinates: [simplified]
      }
    };
  }

  private douglasPeucker(points: number[][], tolerance: number): number[][] {
    if (points.length <= 2) return points;

    // Find the point with maximum distance from line between first and last
    let maxDistance = 0;
    let maxIndex = 0;
    
    for (let i = 1; i < points.length - 1; i++) {
      const distance = this.perpendicularDistance(points[i], points[0], points[points.length - 1]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }

    // If max distance is greater than tolerance, recursively simplify
    if (maxDistance > tolerance) {
      const left = this.douglasPeucker(points.slice(0, maxIndex + 1), tolerance);
      const right = this.douglasPeucker(points.slice(maxIndex), tolerance);
      
      return [...left.slice(0, -1), ...right];
    } else {
      return [points[0], points[points.length - 1]];
    }
  }

  private perpendicularDistance(point: number[], lineStart: number[], lineEnd: number[]): number {
    const [x, y] = point;
    const [x1, y1] = lineStart;
    const [x2, y2] = lineEnd;
    
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) return Math.sqrt(A * A + B * B);
    
    const param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private async tryInterpolation(
    center: CoordinatesPair,
    duration: number,
    transportMode: TransportMode
  ): Promise<GeoJSON.Feature<GeoJSON.Polygon> | null> {
    // Find nearby cached isochrones for interpolation
    const nearby = await this.findNearbyCachedIsochrones(center, transportMode, 2000); // 2km radius
    
    if (nearby.length < 2) return null;
    
    // Simple interpolation: find two isochrones with durations around target
    const lower = nearby.filter(iso => iso.duration <= duration).sort((a, b) => b.duration - a.duration)[0];
    const upper = nearby.filter(iso => iso.duration >= duration).sort((a, b) => a.duration - b.duration)[0];
    
    if (!lower || !upper || lower.duration === upper.duration) return null;
    
    // Linear interpolation between polygons (simplified)
    const factor = (duration - lower.duration) / (upper.duration - lower.duration);
    
    try {
      const interpolated = this.interpolatePolygons(lower.polygon, upper.polygon, factor);
      console.log(`🧮 Interpolated isochrone between ${lower.duration}min and ${upper.duration}min`);
      return interpolated;
    } catch (error) {
      console.warn('⚠️ Interpolation failed:', error);
      return null;
    }
  }

  private interpolatePolygons(
    poly1: GeoJSON.Feature<GeoJSON.Polygon>,
    poly2: GeoJSON.Feature<GeoJSON.Polygon>,
    factor: number
  ): GeoJSON.Feature<GeoJSON.Polygon> {
    // Simplified polygon interpolation - in practice would use more sophisticated algorithms
    const coords1 = poly1.geometry.coordinates[0];
    const coords2 = poly2.geometry.coordinates[0];
    
    const minLength = Math.min(coords1.length, coords2.length);
    const interpolatedCoords: number[][] = [];
    
    for (let i = 0; i < minLength; i++) {
      const lng = coords1[i][0] + (coords2[i][0] - coords1[i][0]) * factor;
      const lat = coords1[i][1] + (coords2[i][1] - coords1[i][1]) * factor;
      interpolatedCoords.push([lng, lat]);
    }
    
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [interpolatedCoords]
      }
    };
  }

  private async findNearbyCachedIsochrones(
    center: CoordinatesPair,
    transportMode: TransportMode,
    maxDistance: number
  ): Promise<IsochroneData[]> {
    const nearby: IsochroneData[] = [];
    
    // Check memory cache
    for (const cached of this.memoryCache.values()) {
      if (cached.transportMode === transportMode && !this.isExpired(cached)) {
        const distance = this.calculateDistance(center, cached.center);
        if (distance <= maxDistance) {
          nearby.push(cached);
        }
      }
    }
    
    return nearby;
  }

  private calculateDistance([lng1, lat1]: CoordinatesPair, [lng2, lat2]: CoordinatesPair): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private async getFromIndexedDB(cacheKey: string): Promise<IsochroneData | null> {
    if (!this.db) return null;
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['isochrones'], 'readonly');
      const store = transaction.objectStore('isochrones');
      const request = store.get(cacheKey);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  private async saveToIndexedDB(data: IsochroneData): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['isochrones'], 'readwrite');
      const store = transaction.objectStore('isochrones');
      const request = store.put(data);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private isExpired(data: IsochroneData): boolean {
    return Date.now() - data.timestamp > data.ttl;
  }

  private updateAverageResponseTime(responseTime: number): void {
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime + responseTime) / 2;
    this.updateHitRatio();
  }

  private updateHitRatio(): void {
    this.metrics.hitRatio = this.metrics.totalRequests > 0
      ? this.metrics.cacheHits / this.metrics.totalRequests
      : 0;
  }

  private startBackgroundPrecomputation(): void {
    // Start precomputation after 5 seconds
    setTimeout(() => {
      this.precomputePopularAreas();
    }, 5000);
    
    // Schedule periodic precomputation
    setInterval(() => {
      this.precomputePopularAreas();
    }, 60 * 60 * 1000); // Every hour
  }

  private async precomputePopularAreas(): Promise<void> {
    if (this.isPrecomputing) return;
    
    this.isPrecomputing = true;
    console.log('🏗️ Starting background isochrone precomputation...');
    
    try {
      for (const area of this.precomputeAreas) {
        if (Date.now() - area.lastComputed < 24 * 60 * 60 * 1000) {
          continue; // Skip if computed in last 24h
        }
        
        await this.precomputeArea(area);
        area.lastComputed = Date.now();
        
        // Pause between areas to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('❌ Precomputation error:', error);
    } finally {
      this.isPrecomputing = false;
      console.log('✅ Background precomputation completed');
    }
  }

  private async precomputeArea(area: PrecomputeArea): Promise<void> {
    const [minLng, minLat, maxLng, maxLat] = area.bbox;
    const centerLng = (minLng + maxLng) / 2;
    const centerLat = (minLat + maxLat) / 2;
    
    for (const duration of area.durations) {
      for (const transportMode of area.transportModes) {
        try {
          await this.getIsochrone([centerLng, centerLat], duration, transportMode);
          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.warn(`⚠️ Precomputation failed for ${duration}min ${transportMode}:`, error);
        }
      }
    }
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  async clearCache(): Promise<void> {
    this.memoryCache.clear();
    
    if (this.db) {
      const transaction = this.db.transaction(['isochrones'], 'readwrite');
      const store = transaction.objectStore('isochrones');
      await store.clear();
    }
    
    this.metrics = {
      hitRatio: 0,
      totalRequests: 0,
      cacheHits: 0,
      precomputedHits: 0,
      interpolatedResults: 0,
      averageResponseTime: 0
    };
    
    console.log('🧹 Isochrone cache cleared');
  }
}

export const isochroneCacheService = IsochroneCacheService.getInstance();