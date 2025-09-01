interface OfflineData {
  searches: Array<{
    query: string;
    results: any[];
    timestamp: number;
  }>;
  userLocation: [number, number] | null;
  preferences: Record<string, any>;
}

export class OfflineStorageService {
  private readonly STORAGE_KEY = 'locasimple_offline_data';
  private data: OfflineData = {
    searches: [],
    userLocation: null,
    preferences: {}
  };

  constructor() {
    this.loadFromStorage();
  }

  async saveSearch(query: string, results: any[]): Promise<void> {
    this.data.searches.unshift({
      query,
      results,
      timestamp: Date.now()
    });

    // Garder seulement les 20 dernières recherches
    this.data.searches = this.data.searches.slice(0, 20);
    
    this.saveToStorage();
  }

  async getOfflineSearches(): Promise<OfflineData['searches']> {
    return this.data.searches;
  }

  async saveUserLocation(location: [number, number]): Promise<void> {
    this.data.userLocation = location;
    this.saveToStorage();
  }

  async getUserLocation(): Promise<[number, number] | null> {
    return this.data.userLocation;
  }

  async savePreferences(preferences: Record<string, any>): Promise<void> {
    this.data.preferences = { ...this.data.preferences, ...preferences };
    this.saveToStorage();
  }

  async getPreferences(): Promise<Record<string, any>> {
    return this.data.preferences;
  }

  async loadOfflineData(): Promise<void> {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.data = { ...this.data, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Erreur chargement données offline:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Erreur sauvegarde données offline:', error);
    }
  }

  clear(): void {
    this.data = {
      searches: [],
      userLocation: null,
      preferences: {}
    };
    localStorage.removeItem(this.STORAGE_KEY);
  }
}