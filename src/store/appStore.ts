
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TransportMode, DistanceUnit } from '@/types/map';

interface AppState {
  isInitialized: boolean;
  currentLocation: [number, number] | null;
  selectedTransportMode: TransportMode;
  selectedDistanceUnit: DistanceUnit;
  
  setInitialized: (initialized: boolean) => void;
  setCurrentLocation: (location: [number, number] | null) => void;
  setTransportMode: (mode: TransportMode) => void;
  setDistanceUnit: (unit: DistanceUnit) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      isInitialized: false,
      currentLocation: null,
      selectedTransportMode: 'walking',
      selectedDistanceUnit: 'km',
      
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      setCurrentLocation: (location) => set({ currentLocation: location }),
      setTransportMode: (mode) => set({ selectedTransportMode: mode }),
      setDistanceUnit: (unit) => set({ selectedDistanceUnit: unit }),
    }),
    { name: 'app-store' }
  )
);
