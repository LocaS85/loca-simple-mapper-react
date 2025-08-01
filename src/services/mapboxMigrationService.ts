import { mapboxConfigService } from './mapboxConfigService';
import { secureMapboxService } from './secureMapboxService';

/**
 * Service de migration pour la transition vers l'infrastructure sécurisée Mapbox
 * Gère la migration progressive des anciens services vers le proxy sécurisé
 */
class MapboxMigrationService {
  private static instance: MapboxMigrationService;
  private migrationStatus = new Map<string, boolean>();

  static getInstance(): MapboxMigrationService {
    if (!MapboxMigrationService.instance) {
      MapboxMigrationService.instance = new MapboxMigrationService();
    }
    return MapboxMigrationService.instance;
  }

  /**
   * Migre un composant vers le service sécurisé
   */
  async migrateComponent(componentName: string): Promise<boolean> {
    try {
      console.log(`🔄 Migration de ${componentName} vers le service sécurisé...`);
      
      // Test de connectivité avec le service sécurisé
      await secureMapboxService.geocodeForward('test');
      
      this.migrationStatus.set(componentName, true);
      console.log(`✅ Migration de ${componentName} terminée`);
      return true;
      
    } catch (error) {
      console.error(`❌ Échec migration de ${componentName}:`, error);
      this.migrationStatus.set(componentName, false);
      return false;
    }
  }

  /**
   * Vérifie si un composant est migré
   */
  isComponentMigrated(componentName: string): boolean {
    return this.migrationStatus.get(componentName) === true;
  }

  /**
   * Obtient un token compatible (nouveau ou ancien)
   */
  async getCompatibleToken(): Promise<string> {
    try {
      // Essayer d'abord le service sécurisé
      return await mapboxConfigService.getMapboxToken();
    } catch (error) {
      console.warn('🔄 Fallback vers token local:', error);
      
      // Fallback vers localStorage
      const localToken = localStorage.getItem('MAPBOX_ACCESS_TOKEN');
      if (localToken && localToken.startsWith('pk.')) {
        return localToken;
      }
      
      throw new Error('Aucun token Mapbox disponible');
    }
  }

  /**
   * Valide l'infrastructure sécurisée
   */
  async validateSecureInfrastructure(): Promise<{
    isReady: boolean;
    edgeFunctionStatus: boolean;
    tokenStatus: boolean;
    proxyStatus: boolean;
  }> {
    try {
      // Test 1: Edge function mapbox-config
      let tokenStatus = false;
      try {
        await mapboxConfigService.getMapboxToken();
        tokenStatus = true;
      } catch (error) {
        console.warn('⚠️ Edge function mapbox-config non disponible:', error);
      }

      // Test 2: Service proxy (via geocoding test)
      let proxyStatus = false;
      try {
        await secureMapboxService.geocodeForward('Paris');
        proxyStatus = true;
      } catch (error) {
        console.warn('⚠️ Proxy Mapbox non disponible:', error);
      }

      const isReady = tokenStatus && proxyStatus;
      
      return {
        isReady,
        edgeFunctionStatus: tokenStatus,
        tokenStatus,
        proxyStatus
      };
      
    } catch (error) {
      console.error('❌ Erreur validation infrastructure:', error);
      return {
        isReady: false,
        edgeFunctionStatus: false,
        tokenStatus: false,
        proxyStatus: false
      };
    }
  }

  /**
   * Nettoie l'ancien cache et tokens locaux
   */
  cleanupLegacyTokens(): void {
    try {
      // Nettoyer localStorage
      const legacyKeys = ['MAPBOX_ACCESS_TOKEN', 'mapbox_token_cache'];
      legacyKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log(`🧹 Suppression token legacy: ${key}`);
        }
      });

      // Nettoyer cache du service sécurisé
      secureMapboxService.clearCache();
      mapboxConfigService.clearCache();
      
      console.log('✅ Nettoyage tokens legacy terminé');
    } catch (error) {
      console.error('❌ Erreur nettoyage legacy:', error);
    }
  }

  /**
   * Rapport de migration
   */
  getMigrationReport() {
    const migratedComponents = Array.from(this.migrationStatus.entries())
      .filter(([, status]) => status)
      .map(([name]) => name);
    
    const failedComponents = Array.from(this.migrationStatus.entries())
      .filter(([, status]) => !status)
      .map(([name]) => name);
    
    return {
      total: this.migrationStatus.size,
      migrated: migratedComponents.length,
      failed: failedComponents.length,
      migratedComponents,
      failedComponents,
      migrationRate: this.migrationStatus.size > 0 
        ? Math.round((migratedComponents.length / this.migrationStatus.size) * 100) 
        : 0
    };
  }
}

export const mapboxMigrationService = MapboxMigrationService.getInstance();