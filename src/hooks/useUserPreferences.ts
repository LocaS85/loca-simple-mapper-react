import { useEffect, useState } from 'react';
import { userPreferencesService, UserPreferences } from '@/services/UserPreferencesService';

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    userPreferencesService.getPreferences()
  );

  useEffect(() => {
    // S'abonner aux changements de préférences
    const unsubscribe = userPreferencesService.subscribe(setPreferences);
    
    return unsubscribe;
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    userPreferencesService.updatePreferences(updates);
  };

  const resetPreferences = () => {
    userPreferencesService.resetToDefaults();
  };

  const getPreference = <K extends keyof UserPreferences>(key: K): UserPreferences[K] => {
    return userPreferencesService.getPreference(key);
  };

  return {
    preferences,
    updatePreferences,
    resetPreferences,
    getPreference,
    exportPreferences: () => userPreferencesService.exportPreferences(),
    importPreferences: (data: string) => userPreferencesService.importPreferences(data),
    getUsageStats: () => userPreferencesService.getUsageStats()
  };
};