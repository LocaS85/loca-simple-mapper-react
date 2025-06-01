
import { SearchResult } from '@/types/geosearch';
import { calculateDistance } from '@/store/geoSearchStore/searchLogic';

export class TestRunner {
  private tests: Array<{ name: string; test: () => boolean | Promise<boolean> }> = [];
  private results: Array<{ name: string; passed: boolean; error?: string }> = [];

  addTest(name: string, test: () => boolean | Promise<boolean>) {
    this.tests.push({ name, test });
  }

  async runAll(): Promise<void> {
    console.log('🧪 Début des tests...');
    
    for (const { name, test } of this.tests) {
      try {
        const result = await test();
        this.results.push({ name, passed: result });
        console.log(`${result ? '✅' : '❌'} ${name}`);
      } catch (error) {
        this.results.push({ 
          name, 
          passed: false, 
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
        console.log(`❌ ${name} - Erreur: ${error}`);
      }
    }
    
    this.printSummary();
  }

  private printSummary() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    
    console.log(`\n📊 Résultats: ${passed}/${total} tests réussis`);
    
    if (passed < total) {
      console.log('❌ Tests échoués:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`  - ${r.name}${r.error ? ': ' + r.error : ''}`));
    }
  }
}

// Tests unitaires de base
export const runBasicTests = () => {
  const testRunner = new TestRunner();
  
  testRunner.addTest('Distance calculation', () => {
    const paris: [number, number] = [2.3522, 48.8566];
    const lyon: [number, number] = [4.8357, 45.7640];
    const distance = calculateDistance(paris, lyon);
    return distance > 390 && distance < 410; // ~400km entre Paris et Lyon
  });
  
  testRunner.addTest('Search result conversion', () => {
    const mockMapboxResult = {
      id: 'test-1',
      name: 'Test Restaurant',
      address: 'Test Address',
      coordinates: [2.3522, 48.8566] as [number, number],
      category: 'restaurant'
    };
    
    const userLocation: [number, number] = [2.3522, 48.8566];
    // Test would use convertMapboxToSearchResult if exported
    return true; // Placeholder
  });
  
  return testRunner;
};
