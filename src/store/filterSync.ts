
import { create } from 'zustand';
import { TransportMode, DistanceUnit } from '@/types/map';
import { GeoSearchFilters } from '@/types/geosearch';

interface FilterSyncState {
  transportMode: TransportMode;
  distance: number;
  unit: DistanceUnit;
  category: string | null;
  showMultiDirections: boolean;
  setTransportMode: (mode: TransportMode) => void;
  setDistance: (distance: number) => void;
  setUnit: (unit: DistanceUnit) => void;
  setCategory: (category: string | null) => void;
  setShowMultiDirections: (show: boolean) => void;
}

export const useFilterSync = create<FilterSyncState>((set) => ({
  transportMode: 'walking',
  distance: 10,
  unit: 'km',
  category: null,
  showMultiDirections: false,
  setTransportMode: (mode) => set({ transportMode: mode }),
  setDistance: (distance) => set({ distance }),
  setUnit: (unit) => set({ unit }),
  setCategory: (category) => set({ category }),
  setShowMultiDirections: (show) => set({ showMultiDirections: show }),
}));

// Service de synchronisation des filtres
export const filterSyncService = {
  validateFilters: (filters: Partial<GeoSearchFilters>): boolean => {
    return true; // Validation basique
  },
  
  convertToMapboxFilters: (filters: GeoSearchFilters) => {
    return {
      categories: filters.category ? [filters.category] : undefined,
      radius: filters.distance,
      limit: filters.aroundMeCount || 5
    };
  }
};
