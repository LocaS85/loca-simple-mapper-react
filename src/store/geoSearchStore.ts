
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { filterSyncService } from './filterSync';
import { GeoSearchStore, initialState, defaultFilters } from './geoSearchStore/types';
import { createGeoSearchActions } from './geoSearchStore/actions';

export const useGeoSearchStore = create<GeoSearchStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      defaultFilters,
      ...createGeoSearchActions(set, get)
    }),
    {
      name: 'geo-search-store',
    }
  )
);
