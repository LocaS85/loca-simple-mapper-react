
import { SearchResult } from '@/types/geosearch';

export const mockDataService = {
  getMockResults(center: [number, number], query?: string): SearchResult[] {
    if (query?.toLowerCase().includes('ikea')) {
      return [
        {
          id: 'mock-ikea-1',
          name: 'IKEA Roissy',
          address: 'Centre Commercial Aéroville, 93290 Tremblay-en-France',
          coordinates: [center[0] + 0.05, center[1] + 0.03] as [number, number],
          type: 'shopping',
          category: 'shopping',
          distance: 5.2,
          duration: 15
        },
        {
          id: 'mock-ikea-2',
          name: 'IKEA Franconville',
          address: 'ZAC des Closeaux, 95130 Franconville',
          coordinates: [center[0] - 0.03, center[1] + 0.04] as [number, number],
          type: 'shopping',
          category: 'shopping',
          distance: 8.1,
          duration: 20
        }
      ];
    }

    return [
      {
        id: 'mock-1',
        name: 'Restaurant Local',
        address: 'Adresse exemple',
        coordinates: [center[0] + 0.001, center[1] + 0.001],
        type: 'restaurant',
        category: 'restaurant',
        distance: 0.1,
        duration: 2
      }
    ];
  }
};
