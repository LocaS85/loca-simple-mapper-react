
import { useTranslation } from 'react-i18next';
import { translationService } from '@/services/translationService';

export interface UseTranslationsReturn {
  t: (key: string, options?: any) => string;
  changeLanguage: (language: string) => Promise<void>;
  currentLanguage: string;
  availableLanguages: string[];
  getSection: (section: string) => Record<string, any>;
  getSafeTranslation: (key: string, fallback?: string) => string;
}

export const useTranslations = (): UseTranslationsReturn => {
  const { t, i18n } = useTranslation();

  const getSafeTranslation = (key: string, fallback?: string): string => {
    try {
      return translationService.get(key, { fallback });
    } catch (error) {
      console.warn('Translation service error:', error);
      return fallback || key;
    }
  };

  const changeLanguage = async (language: string): Promise<void> => {
    try {
      await translationService.changeLanguage(language);
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error);
    }
  };

  const getSection = (section: string): Record<string, any> => {
    try {
      return translationService.getSection(section);
    } catch (error) {
      console.warn('Translation section error:', error);
      return {};
    }
  };

  // Safe t function with fallback
  const safeT = (key: string, fallback?: string): string => {
    try {
      const translation = t(key);
      if (translation === key && fallback) {
        return fallback;
      }
      return translation;
    } catch (error) {
      console.warn('Translation error:', error);
      return fallback || key;
    }
  };

  return {
    t: safeT,
    changeLanguage,
    currentLanguage: i18n?.language || 'fr',
    availableLanguages: translationService?.getAvailableLanguages() || ['fr', 'en'],
    getSection,
    getSafeTranslation
  };
};
