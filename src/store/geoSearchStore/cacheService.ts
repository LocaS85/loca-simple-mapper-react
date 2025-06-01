
import { SearchResult } from '@/types/geosearch';

export class CacheService {
  private cache: Map<string, { results: SearchResult[]; timestamp: number; expiry: number }>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 50;

  constructor() {
    this.cache = new Map();
  }

  set(key: string, results: SearchResult[]): void {
    // Clean old entries if cache is too large
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanOldEntries();
    }

    this.cache.set(key, {
      results,
      timestamp: Date.now(),
      expiry: Date.now() + this.CACHE_DURATION
    });
  }

  get(key: string): SearchResult[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.results;
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanOldEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; hitRate: number } {
    return {
      size: this.cache.size,
      hitRate: 0 // Could be implemented with hit/miss tracking
    };
  }
}
