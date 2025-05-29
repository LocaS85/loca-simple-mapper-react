
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
    return translationService.get(key, { fallback });
  };

  const changeLanguage = async (language: string): Promise<void> => {
    try {
      await translationService.changeLanguage(language);
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error);
    }
  };

  const getSection = (section: string): Record<string, any> => {
    return translationService.getSection(section);
  };

  return {
    t,
    changeLanguage,
    currentLanguage: i18n.language,
    availableLanguages: translationService.getAvailableLanguages(),
    getSection,
    getSafeTranslation
  };
};
