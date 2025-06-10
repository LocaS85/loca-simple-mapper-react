
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
  key: string;
}

interface CacheOptions {
  maxAge?: number; // en millisecondes
  maxSize?: number; // nombre d'entrées maximum
  priority?: 'low' | 'normal' | 'high';
}

class OfflineCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_MAX_AGE = 30 * 60 * 1000; // 30 minutes
  private readonly DEFAULT_MAX_SIZE = 100;

  // Stocker des données dans le cache
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    const {
      maxAge = this.DEFAULT_MAX_AGE,
      maxSize = this.DEFAULT_MAX_SIZE,
      priority = 'normal'
    } = options;

    // Nettoyer le cache si nécessaire
    this.cleanup(maxSize);

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresIn: maxAge,
      key
    };

    this.cache.set(key, entry);
    
    console.log(`💾 Données mises en cache: ${key} (priorité: ${priority})`);
  }

  // Récupérer des données du cache
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Vérifier si l'entrée a expiré
    if (Date.now() - entry.timestamp > entry.expiresIn) {
      this.cache.delete(key);
      console.log(`🗑️ Entrée expirée supprimée: ${key}`);
      return null;
    }

    console.log(`📦 Données récupérées du cache: ${key}`);
    return entry.data;
  }

  // Vérifier si une clé existe et n'a pas expiré
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Supprimer une entrée
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  // Nettoyer les entrées expirées
  cleanup(maxSize?: number): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    // Identifier les entrées expirées
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        expiredKeys.push(key);
      }
    }

    // Supprimer les entrées expirées
    expiredKeys.forEach(key => {
      this.cache.delete(key);
    });

    if (expiredKeys.length > 0) {
      console.log(`🧹 ${expiredKeys.length} entrées expirées supprimées`);
    }

    // Si encore trop d'entrées, supprimer les plus anciennes
    if (maxSize && this.cache.size > maxSize) {
      const entries = Array.from(this.cache.entries()).sort(
        (a, b) => a[1].timestamp - b[1].timestamp
      );
      
      const toDelete = entries.slice(0, this.cache.size - maxSize);
      toDelete.forEach(([key]) => {
        this.cache.delete(key);
      });
      
      console.log(`🧹 ${toDelete.length} anciennes entrées supprimées pour respecter la limite`);
    }
  }

  // Vider tout le cache
  clear(): void {
    this.cache.clear();
    console.log('🗑️ Cache vidé complètement');
  }

  // Obtenir des statistiques du cache
  getStats(): {
    size: number;
    keys: string[];
    memoryUsage: number;
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memoryUsage: JSON.stringify(Array.from(this.cache.values())).length
    };
  }

  // Méthodes spécialisées pour les données géographiques
  cacheSearchResults(query: string, location: [number, number], results: any[], maxAge?: number): void {
    const key = `search_${query}_${location.join(',')}_${JSON.stringify(results.slice(0, 3))}`;
    this.set(key, results, { maxAge, priority: 'high' });
  }

  getCachedSearchResults(query: string, location: [number, number]): any[] | null {
    const key = `search_${query}_${location.join(',')}`;
    const cached = this.get<any[]>(key);
    return cached || null;
  }

  cacheDirections(origin: [number, number], destination: [number, number], directions: any): void {
    const key = `directions_${origin.join(',')}_${destination.join(',')}`;
    this.set(key, directions, { maxAge: 10 * 60 * 1000, priority: 'normal' }); // 10 minutes
  }

  getCachedDirections(origin: [number, number], destination: [number, number]): any | null {
    const key = `directions_${origin.join(',')}_${destination.join(',')}`;
    return this.get(key);
  }
}

export const offlineCacheService = new OfflineCacheService();
