import React, { useEffect, useState } from 'react';
import { secureMapboxService } from '@/services/secureMapboxService';
import { mapboxMigrationService } from '@/services/mapboxMigrationService';

export const SecureMapboxTest: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    const testSecureInfrastructure = async () => {
      try {
        console.log('🧪 Test de l\'infrastructure sécurisée Mapbox...');
        
        // Test 1: Validation infrastructure
        const validation = await mapboxMigrationService.validateSecureInfrastructure();
        
        if (!validation.isReady) {
          throw new Error(`Infrastructure non prête: Token=${validation.tokenStatus}, Proxy=${validation.proxyStatus}`);
        }
        
        // Test 2: Geocoding sécurisé
        const results = await secureMapboxService.geocodeForward('Paris');
        
        if (!results.features || results.features.length === 0) {
          throw new Error('Aucun résultat de géocodage');
        }
        
        setStatus('success');
        setDetails(`✅ Infrastructure sécurisée opérationnelle! ${results.features.length} résultats trouvés.`);
        
        // Migration des composants GeoSearch
        await mapboxMigrationService.migrateComponent('GeoSearch');
        
      } catch (error) {
        console.error('❌ Test infrastructure échoué:', error);
        setStatus('error');
        setDetails(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    };

    testSecureInfrastructure();
  }, []);

  if (status === 'loading') {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-700">🔄 Test de l'infrastructure sécurisée...</p>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-lg ${status === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
      <p className={status === 'success' ? 'text-green-700' : 'text-red-700'}>
        {details}
      </p>
      {status === 'success' && (
        <p className="text-sm text-green-600 mt-2">
          Phase 1A complète : Infrastructure Mapbox sécurisée ✅
        </p>
      )}
    </div>
  );
};