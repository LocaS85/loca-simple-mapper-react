
import { SearchResult } from '@/types/geosearch';

export class CacheService {
  private cache = new Map<string, { results: SearchResult[]; timestamp: number; expiry: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  set(key: string, results: SearchResult[]): void {
    this.cache.set(key, {
      results,
      timestamp: Date.now(),
      expiry: Date.now() + this.CACHE_DURATION
    });
  }

  get(key: string): SearchResult[] | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.results;
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
}
