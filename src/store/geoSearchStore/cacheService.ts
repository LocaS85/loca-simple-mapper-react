
import { SearchResult } from '@/types/geosearch';

export class CacheService {
  private cache: Map<string, { results: SearchResult[]; timestamp: number; expiry: number }> = new Map();
  private readonly DEFAULT_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

  /**
   * Get cached results for a key if they exist and are valid
   */
  get(key: string): SearchResult[] | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if cache entry is still valid
    if (Date.now() < entry.expiry) {
      console.log(`📦 Cache hit for ${key} (expires in ${Math.round((entry.expiry - Date.now()) / 1000)}s)`);
      return entry.results;
    } else {
      console.log(`📦 Cache entry expired for ${key}`);
      this.cache.delete(key);
      return null;
    }
  }

  /**
   * Set cached results with an optional custom expiry time
   */
  set(key: string, results: SearchResult[], expiryMs: number = this.DEFAULT_EXPIRY_MS): void {
    console.log(`📥 Storing ${results.length} results in cache with key: ${key}`);
    this.cache.set(key, {
      results,
      timestamp: Date.now(),
      expiry: Date.now() + expiryMs
    });
    
    // Clean up old entries when adding new ones
    this.cleanup();
  }

  /**
   * Clear specific cached entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    console.log('🧹 Clearing search cache');
    this.cache.clear();
  }

  /**
   * Get the number of entries in the cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let deletedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    
    if (deletedCount > 0) {
      console.log(`🧹 Removed ${deletedCount} expired cache entries`);
    }
  }
}
