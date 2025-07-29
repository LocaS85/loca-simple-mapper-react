
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { filterSyncService } from './filterSync';
import { GeoSearchStore, initialState, defaultFilters } from './geoSearchStore/types';
import { createGeoSearchActions } from './geoSearchStore/actions';

export const useGeoSearchStore = create<GeoSearchStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        defaultFilters,
        ...createGeoSearchActions(set, get)
      }),
      {
        name: 'geo-search-store',
        partialize: (state) => ({
          filters: state.filters,
          userLocation: state.userLocation
        }),
        version: 1
      }
    ),
    {
      name: 'geo-search-store',
    }
  )
);
