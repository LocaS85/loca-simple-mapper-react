import { SearchResult } from '@/types/geosearch';
import { searchBoxService } from './searchBoxService';
import { getMapboxToken } from '@/utils/mapboxConfig';

interface BrandSearchResult extends SearchResult {
  isBrand?: boolean;
  searchExpanded?: boolean;
  expandedFrom?: string;
}

interface BrandConfig {
  name: string;
  keywords: string[];
  category: string;
  types: string[];
  alternativeSearches: string[];
}

export const brandSearchService = {
  // Configuration des marques principales
  brandConfigs: {
    ikea: {
      name: 'IKEA',
      keywords: ['ikea', 'IKEA'],
      category: 'shopping',
      types: ['poi', 'poi.business', 'poi.shopping'],
      alternativeSearches: ['mobilier', 'meuble magasin', 'furniture store', 'ameublement']
    },
    mcdonalds: {
      name: 'McDonald\'s',
      keywords: ['mcdonalds', 'mcdonald', 'mc donald', 'macdo'],
      category: 'restaurant',
      types: ['poi', 'poi.business', 'poi.food_and_beverage'],
      alternativeSearches: ['fast food', 'restauration rapide', 'burger']
    },
    carrefour: {
      name: 'Carrefour',
      keywords: ['carrefour'],
      category: 'shopping',
      types: ['poi', 'poi.business', 'poi.shopping'],
      alternativeSearches: ['supermarché', 'grande distribution', 'hypermarché']
    },
    pharmacie: {
      name: 'Pharmacie',
      keywords: ['pharmacie', 'pharmacy'],
      category: 'health',
      types: ['poi', 'poi.business', 'poi.medical'],
      alternativeSearches: ['santé', 'médicament', 'soins']
    }
  } as Record<string, BrandConfig>,

  /**
   * Recherche intelligente de marques avec expansion géographique
   */
  async searchBrand(
    query: string,
    center: [number, number],
    options: {
      limit?: number;
      expandRadius?: boolean;
      maxRadius?: number;
    } = {}
  ): Promise<BrandSearchResult[]> {
    const { limit = 10, expandRadius = true, maxRadius = 200 } = options;
    
    console.log('🏪 Recherche de marque:', { query, center, expandRadius });

    // Détecter la marque
    const brandConfig = this.detectBrand(query);
    
    if (!brandConfig) {
      console.log('❌ Marque non reconnue, recherche standard');
      return await searchBoxService.searchPOI(query, center, { limit });
    }

    console.log('✅ Marque détectée:', brandConfig.name);

    // Recherche progressive avec expansion géographique
    const radiusSteps = expandRadius ? [10, 25, 50, 100, maxRadius] : [50];
    
    for (let i = 0; i < radiusSteps.length; i++) {
      const radius = radiusSteps[i];
      const isExpanded = i > 0;
      
      console.log(`🔍 Recherche rayon ${radius}km${isExpanded ? ' (élargie)' : ''}`);
      
      // Essayer d'abord les mots-clés exacts de la marque
      const results = await this.searchWithKeywords(
        brandConfig.keywords,
        center,
        radius,
        brandConfig,
        limit
      );
      
      if (results.length > 0) {
        console.log(`✅ Trouvé ${results.length} résultats à ${radius}km`);
        return results.map(result => ({
          ...result,
          isBrand: true,
          searchExpanded: isExpanded,
          expandedFrom: isExpanded ? `${radiusSteps[0]}km` : undefined
        }));
      }
      
      // Si pas de résultats, essayer les recherches alternatives
      if (i === radiusSteps.length - 1) {
        console.log('🔄 Tentative avec recherches alternatives...');
        const alternativeResults = await this.searchWithAlternatives(
          brandConfig.alternativeSearches,
          center,
          radius,
          brandConfig,
          limit
        );
        
        if (alternativeResults.length > 0) {
          return alternativeResults.map(result => ({
            ...result,
            isBrand: false,
            searchExpanded: true,
            expandedFrom: 'alternatives'
          }));
        }
      }
    }

    console.log('❌ Aucun résultat trouvé pour la marque');
    return [];
  },

  /**
   * Détecte la marque dans la requête
   */
  detectBrand(query: string): BrandConfig | null {
    const lowerQuery = query.toLowerCase().trim();
    
    for (const [brandKey, config] of Object.entries(this.brandConfigs)) {
      const brandConfig = config as BrandConfig;
      if (brandConfig.keywords.some(keyword => 
        lowerQuery.includes(keyword.toLowerCase())
      )) {
        return brandConfig;
      }
    }
    
    return null;
  },

  /**
   * Recherche avec les mots-clés spécifiques de la marque
   */
  async searchWithKeywords(
    keywords: string[],
    center: [number, number],
    radius: number,
    brandConfig: BrandConfig,
    limit: number
  ): Promise<SearchResult[]> {
    
    for (const keyword of keywords) {
      try {
        console.log(`🔍 Recherche mot-clé: "${keyword}"`);
        
        // Utiliser l'API Search Box optimisée
        const results = await searchBoxService.searchPOI(keyword, center, {
          limit,
          radius,
          categories: [brandConfig.category]
        });
        
        if (results.length > 0) {
          // Filtrer les résultats dans le rayon
          const filteredResults = results.filter(result => 
            (result.distance || 0) <= radius
          );
          
          if (filteredResults.length > 0) {
            console.log(`✅ ${filteredResults.length} résultats trouvés avec "${keyword}"`);
            return filteredResults;
          }
        }
      } catch (error) {
        console.error(`❌ Erreur recherche "${keyword}":`, error);
      }
    }
    
    return [];
  },

  /**
   * Recherche avec les termes alternatifs
   */
  async searchWithAlternatives(
    alternatives: string[],
    center: [number, number],
    radius: number,
    brandConfig: BrandConfig,
    limit: number
  ): Promise<SearchResult[]> {
    
    for (const alternative of alternatives) {
      try {
        console.log(`🔄 Recherche alternative: "${alternative}"`);
        
        const results = await searchBoxService.searchPOI(alternative, center, {
          limit,
          radius,
          categories: [brandConfig.category]
        });
        
        if (results.length > 0) {
          const filteredResults = results.filter(result => 
            (result.distance || 0) <= radius
          );
          
          if (filteredResults.length > 0) {
            console.log(`✅ ${filteredResults.length} alternatives trouvées avec "${alternative}"`);
            return filteredResults;
          }
        }
      } catch (error) {
        console.error(`❌ Erreur alternative "${alternative}":`, error);
      }
    }
    
    return [];
  },

  /**
   * Recherche directe sans expansion (pour l'autocomplétion)
   */
  async getQuickSuggestions(
    query: string,
    center: [number, number],
    limit: number = 5
  ): Promise<BrandSearchResult[]> {
    
    const brandConfig = this.detectBrand(query);
    
    if (!brandConfig) {
      // Recherche standard
      const results = await searchBoxService.searchPOI(query, center, { limit });
      return results.map(result => ({ ...result, isBrand: false }));
    }

    // Recherche rapide de marque dans un rayon limité
    const results = await this.searchWithKeywords(
      brandConfig.keywords,
      center,
      25, // Rayon limité pour suggestions rapides
      brandConfig,
      limit
    );

    if (results.length === 0) {
      // Ajouter une suggestion d'élargissement
      return [{
        id: 'expand-search',
        name: `${brandConfig.name} - Élargir la recherche`,
        address: `Aucun ${brandConfig.name} trouvé à proximité. Essayez une recherche élargie.`,
        coordinates: center,
        type: 'suggestion',
        category: brandConfig.category,
        distance: 0,
        duration: 0,
        isBrand: true,
        searchExpanded: false
      }];
    }

    return results.map(result => ({ ...result, isBrand: true }));
  },

  /**
   * Ajoute une nouvelle configuration de marque
   */
  addBrandConfig(key: string, config: BrandConfig): void {
    this.brandConfigs[key] = config;
  },

  /**
   * Obtient la liste des marques supportées
   */
  getSupportedBrands(): string[] {
    return Object.values(this.brandConfigs).map(config => (config as BrandConfig).name);
  }
};