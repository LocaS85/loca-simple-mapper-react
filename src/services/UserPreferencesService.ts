import { TransportMode, DistanceUnit } from '@/types/map';

export interface UserPreferences {
  showMultiDirections: boolean;
  preferredTransport: TransportMode;
  preferredDistance: number;
  preferredUnit: DistanceUnit;
  autoSearch: boolean;
  rememberLocation: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  showMultiDirections: false,
  preferredTransport: 'walking',
  preferredDistance: 5,
  preferredUnit: 'km',
  autoSearch: true,
  rememberLocation: true,
  theme: 'system',
  language: 'fr'
};

const STORAGE_KEY = 'geosearch_user_preferences';
const STORAGE_VERSION = '1.0.0';

class UserPreferencesService {
  private preferences: UserPreferences = { ...DEFAULT_PREFERENCES };
  private listeners: ((preferences: UserPreferences) => void)[] = [];

  constructor() {
    this.loadPreferences();
  }

  // Charger les préférences depuis localStorage
  private loadPreferences(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Vérifier la version et migrer si nécessaire
        if (data.version !== STORAGE_VERSION) {
          this.migratePreferences(data);
        } else {
          this.preferences = { ...DEFAULT_PREFERENCES, ...data.preferences };
        }
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des préférences:', error);
      this.preferences = { ...DEFAULT_PREFERENCES };
    }
  }

  // Sauvegarder les préférences dans localStorage
  private savePreferences(): void {
    try {
      const data = {
        version: STORAGE_VERSION,
        preferences: this.preferences,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des préférences:', error);
    }
  }

  // Migrer les anciennes préférences
  private migratePreferences(oldData: any): void {
    console.log('Migration des préférences utilisateur...');
    
    // Garder les valeurs valides de l'ancien format
    const migrated: Partial<UserPreferences> = {};
    
    if (oldData.showMultiDirections !== undefined) {
      migrated.showMultiDirections = Boolean(oldData.showMultiDirections);
    }
    
    if (oldData.preferredTransport && ['walking', 'cycling', 'car', 'bus', 'train'].includes(oldData.preferredTransport)) {
      migrated.preferredTransport = oldData.preferredTransport;
    }
    
    if (typeof oldData.preferredDistance === 'number' && oldData.preferredDistance > 0) {
      migrated.preferredDistance = oldData.preferredDistance;
    }
    
    if (oldData.preferredUnit && ['km', 'miles'].includes(oldData.preferredUnit)) {
      migrated.preferredUnit = oldData.preferredUnit;
    }

    this.preferences = { ...DEFAULT_PREFERENCES, ...migrated };
    this.savePreferences();
  }

  // Obtenir toutes les préférences
  getPreferences(): UserPreferences {
    return { ...this.preferences };
  }

  // Obtenir une préférence spécifique
  getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
    return this.preferences[key];
  }

  // Mettre à jour une ou plusieurs préférences
  updatePreferences(updates: Partial<UserPreferences>): void {
    const oldPreferences = { ...this.preferences };
    this.preferences = { ...this.preferences, ...updates };
    
    this.savePreferences();
    this.notifyListeners();
    
    // Log des changements importants
    if (updates.showMultiDirections !== undefined && updates.showMultiDirections !== oldPreferences.showMultiDirections) {
      console.log(`Tracés multiples ${updates.showMultiDirections ? 'activés' : 'désactivés'} par défaut`);
    }
  }

  // Réinitialiser aux valeurs par défaut
  resetToDefaults(): void {
    this.preferences = { ...DEFAULT_PREFERENCES };
    this.savePreferences();
    this.notifyListeners();
  }

  // S'abonner aux changements de préférences
  subscribe(listener: (preferences: UserPreferences) => void): () => void {
    this.listeners.push(listener);
    
    // Retourner une fonction de désabonnement
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notifier tous les listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getPreferences());
      } catch (error) {
        console.warn('Erreur dans un listener de préférences:', error);
      }
    });
  }

  // Exporter les préférences pour sauvegarde/partage
  exportPreferences(): string {
    return JSON.stringify({
      version: STORAGE_VERSION,
      preferences: this.preferences,
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  // Importer des préférences depuis un export
  importPreferences(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.preferences && typeof parsed.preferences === 'object') {
        // Valider les données importées
        const validPreferences: Partial<UserPreferences> = {};
        
        Object.keys(DEFAULT_PREFERENCES).forEach(key => {
          const typedKey = key as keyof UserPreferences;
          if (parsed.preferences[typedKey] !== undefined) {
            (validPreferences as any)[typedKey] = parsed.preferences[typedKey];
          }
        });
        
        this.updatePreferences(validPreferences);
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Erreur lors de l\'import des préférences:', error);
      return false;
    }
  }

  // Obtenir les statistiques d'utilisation
  getUsageStats(): {
    multiDirectionsUsage: number;
    preferredTransportUsage: Record<TransportMode, number>;
    averageSearchDistance: number;
  } {
    // Pour l'instant, retourner des valeurs statiques
    // Dans une vraie implémentation, on pourrait stocker ces stats
    return {
      multiDirectionsUsage: this.preferences.showMultiDirections ? 100 : 0,
      preferredTransportUsage: {
        walking: this.preferences.preferredTransport === 'walking' ? 100 : 0,
        cycling: this.preferences.preferredTransport === 'cycling' ? 100 : 0,
        car: this.preferences.preferredTransport === 'car' ? 100 : 0,
        driving: this.preferences.preferredTransport === 'car' ? 100 : 0,
        bus: this.preferences.preferredTransport === 'bus' ? 100 : 0,
        train: this.preferences.preferredTransport === 'train' ? 100 : 0,
        transit: this.preferences.preferredTransport === 'bus' ? 100 : 0
      },
      averageSearchDistance: this.preferences.preferredDistance
    };
  }
}

export const userPreferencesService = new UserPreferencesService();
export default userPreferencesService;