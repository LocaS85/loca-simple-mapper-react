import { SearchResult, CoordinatesPair } from '@/types/unified';

interface SpatialGridCell {
  id: string;
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  data: SearchResult[];
  timestamp: number;
  ttl: number;
  density: number;
  popularity: number;
}

interface SpatialMetrics {
  hitRatio: number;
  avgLatency: number;
  totalRequests: number;
  cacheHits: number;
  spatialCoverage: number;
}

export class SpatialCacheService {
  private static instance: SpatialCacheService;
  private dbName = 'spatial-cache-db';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private memoryCache = new Map<string, SpatialGridCell>();
  private gridSize = 0.01; // ~1km at equator
  private maxMemorySize = 100; // max cells in memory
  private metrics: SpatialMetrics = {
    hitRatio: 0,
    avgLatency: 0,
    totalRequests: 0,
    cacheHits: 0,
    spatialCoverage: 0
  };

  static getInstance(): SpatialCacheService {
    if (!SpatialCacheService.instance) {
      SpatialCacheService.instance = new SpatialCacheService();
    }
    return SpatialCacheService.instance;
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ SpatialCacheService initialized with IndexedDB');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('spatial-grid')) {
          const store = db.createObjectStore('spatial-grid', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('popularity', 'popularity');
          store.createIndex('bbox', 'bbox', { multiEntry: false });
        }
      };
    });
  }

  private generateCellId(bbox: [number, number, number, number]): string {
    return `${Math.floor(bbox[0] / this.gridSize)}_${Math.floor(bbox[1] / this.gridSize)}`;
  }

  private calculateBBox(center: CoordinatesPair, radius: number): [number, number, number, number] {
    const [lng, lat] = center;
    const radiusInDegrees = radius / 111; // Rough conversion km to degrees
    
    return [
      lng - radiusInDegrees,
      lat - radiusInDegrees, 
      lng + radiusInDegrees,
      lat + radiusInDegrees
    ];
  }

  async getCachedResults(
    center: CoordinatesPair, 
    radius: number, 
    category?: string
  ): Promise<SearchResult[] | null> {
    const startTime = performance.now();
    this.metrics.totalRequests++;
    
    try {
      const bbox = this.calculateBBox(center, radius);
      const cellId = this.generateCellId(bbox);
      
      // Check memory cache first
      let cell = this.memoryCache.get(cellId);
      
      if (!cell && this.db) {
        // Check IndexedDB
        cell = await this.getFromIndexedDB(cellId);
        if (cell) {
          this.memoryCache.set(cellId, cell);
          this.cleanupMemoryCache();
        }
      }
      
      if (cell && !this.isCellExpired(cell)) {
        let results = cell.data;
        
        // Filter by category if specified
        if (category) {
          results = results.filter(r => r.category === category);
        }
        
        // Filter by distance
        results = results.filter(result => 
          this.calculateDistance(center, result.coordinates) <= radius
        );
        
        // Update popularity
        cell.popularity++;
        this.updateCellInDB(cell);
        
        this.metrics.cacheHits++;
        this.metrics.avgLatency = (this.metrics.avgLatency + (performance.now() - startTime)) / 2;
        this.updateMetrics();
        
        console.log(`🎯 Cache spatial HIT pour ${cellId}: ${results.length} résultats`);
        return results;
      }
      
      this.metrics.avgLatency = (this.metrics.avgLatency + (performance.now() - startTime)) / 2;
      this.updateMetrics();
      
      console.log(`❌ Cache spatial MISS pour ${cellId}`);
      return null;
      
    } catch (error) {
      console.error('❌ Erreur cache spatial:', error);
      return null;
    }
  }

  async cacheResults(
    center: CoordinatesPair,
    radius: number,
    results: SearchResult[],
    ttlMinutes: number = 30
  ): Promise<void> {
    try {
      const bbox = this.calculateBBox(center, radius);
      const cellId = this.generateCellId(bbox);
      
      const cell: SpatialGridCell = {
        id: cellId,
        bbox,
        data: results,
        timestamp: Date.now(),
        ttl: ttlMinutes * 60 * 1000,
        density: results.length / (radius * radius), // results per km²
        popularity: 1
      };
      
      // Store in memory and IndexedDB
      this.memoryCache.set(cellId, cell);
      await this.saveToIndexedDB(cell);
      this.cleanupMemoryCache();
      
      console.log(`💾 Cache spatial stocké pour ${cellId}: ${results.length} résultats`);
      
      // Preload adjacent cells if high density
      if (cell.density > 10) {
        this.scheduleAdjacentPreload(center, radius);
      }
      
    } catch (error) {
      console.error('❌ Erreur stockage cache spatial:', error);
    }
  }

  private async getFromIndexedDB(cellId: string): Promise<SpatialGridCell | null> {
    if (!this.db) return null;
    
    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['spatial-grid'], 'readonly');
      const store = transaction.objectStore('spatial-grid');
      const request = store.get(cellId);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  private async saveToIndexedDB(cell: SpatialGridCell): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['spatial-grid'], 'readwrite');
      const store = transaction.objectStore('spatial-grid');
      const request = store.put(cell);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async updateCellInDB(cell: SpatialGridCell): Promise<void> {
    try {
      await this.saveToIndexedDB(cell);
    } catch (error) {
      console.error('❌ Erreur mise à jour cellule:', error);
    }
  }

  private isCellExpired(cell: SpatialGridCell): boolean {
    return Date.now() - cell.timestamp > cell.ttl;
  }

  private cleanupMemoryCache(): void {
    if (this.memoryCache.size > this.maxMemorySize) {
      // Remove oldest entries
      const entries = Array.from(this.memoryCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toRemove = entries.slice(0, entries.length - this.maxMemorySize);
      toRemove.forEach(([key]) => this.memoryCache.delete(key));
    }
  }

  private scheduleAdjacentPreload(center: CoordinatesPair, radius: number): void {
    // Schedule preload of adjacent cells for smooth navigation
    setTimeout(() => {
      this.preloadAdjacentCells(center, radius);
    }, 1000);
  }

  private async preloadAdjacentCells(center: CoordinatesPair, radius: number): Promise<void> {
    const [lng, lat] = center;
    const offset = this.gridSize;
    
    const adjacentCenters: CoordinatesPair[] = [
      [lng + offset, lat],
      [lng - offset, lat],
      [lng, lat + offset],
      [lng, lat - offset],
      [lng + offset, lat + offset],
      [lng - offset, lat - offset],
      [lng + offset, lat - offset],
      [lng - offset, lat + offset]
    ];
    
    console.log(`🔮 Préchargement ${adjacentCenters.length} cellules adjacentes`);
    
    // This would trigger background loading - implementation depends on search service
    // For now, just log the intent
  }

  private calculateDistance([lng1, lat1]: CoordinatesPair, [lng2, lat2]: CoordinatesPair): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private updateMetrics(): void {
    this.metrics.hitRatio = this.metrics.totalRequests > 0 
      ? this.metrics.cacheHits / this.metrics.totalRequests 
      : 0;
    
    this.metrics.spatialCoverage = this.memoryCache.size + 
      (this.db ? 1 : 0); // Rough estimate
  }

  getMetrics(): SpatialMetrics {
    return { ...this.metrics };
  }

  async clearCache(): Promise<void> {
    this.memoryCache.clear();
    
    if (this.db) {
      const transaction = this.db.transaction(['spatial-grid'], 'readwrite');
      const store = transaction.objectStore('spatial-grid');
      await store.clear();
    }
    
    // Reset metrics
    this.metrics = {
      hitRatio: 0,
      avgLatency: 0,
      totalRequests: 0,
      cacheHits: 0,
      spatialCoverage: 0
    };
    
    console.log('🧹 Cache spatial vidé');
  }

  async cleanupExpired(): Promise<void> {
    const now = Date.now();
    
    // Cleanup memory cache
    for (const [key, cell] of this.memoryCache.entries()) {
      if (this.isCellExpired(cell)) {
        this.memoryCache.delete(key);
      }
    }
    
    // Cleanup IndexedDB
    if (this.db) {
      const transaction = this.db.transaction(['spatial-grid'], 'readwrite');
      const store = transaction.objectStore('spatial-grid');
      const index = store.index('timestamp');
      
      const request = index.openCursor();
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          const cell = cursor.value as SpatialGridCell;
          if (now - cell.timestamp > cell.ttl) {
            cursor.delete();
          }
          cursor.continue();
        }
      };
    }
  }
}

export const spatialCacheService = SpatialCacheService.getInstance();