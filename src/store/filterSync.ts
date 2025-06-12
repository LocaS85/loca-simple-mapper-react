
import { create } from 'zustand';
import { TransportMode, DistanceUnit } from '@/types/map';

interface FilterSyncState {
  transportMode: TransportMode;
  distance: number;
  unit: DistanceUnit;
  category: string | null;
  setTransportMode: (mode: TransportMode) => void;
  setDistance: (distance: number) => void;
  setUnit: (unit: DistanceUnit) => void;
  setCategory: (category: string | null) => void;
}

export const useFilterSync = create<FilterSyncState>((set) => ({
  transportMode: 'walking',
  distance: 10,
  unit: 'km',
  category: null,
  setTransportMode: (mode) => set({ transportMode: mode }),
  setDistance: (distance) => set({ distance }),
  setUnit: (unit) => set({ unit }),
  setCategory: (category) => set({ category }),
}));
