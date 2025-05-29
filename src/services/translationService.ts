
import i18n from '@/i18n';

interface TranslationOptions {
  fallback?: string;
  interpolation?: Record<string, any>;
}

class TranslationService {
  // Obtenir une traduction avec fallback automatique
  get(key: string, options: TranslationOptions = {}): string {
    const { fallback, interpolation } = options;
    
    try {
      const translation = i18n.t(key, interpolation);
      
      // Si la traduction est identique à la clé, utiliser le fallback
      if (translation === key && fallback) {
        return fallback;
      }
      
      return translation;
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return fallback || key;
    }
  }

  // Changer la langue avec persistance - correction du type de retour
  async changeLanguage(language: string): Promise<void> {
    await i18n.changeLanguage(language);
  }

  // Obtenir la langue actuelle
  getCurrentLanguage(): string {
    return i18n.language;
  }

  // Obtenir les langues disponibles
  getAvailableLanguages(): string[] {
    return Object.keys(i18n.store.data);
  }

  // Vérifier si une clé de traduction existe
  exists(key: string): boolean {
    return i18n.exists(key);
  }

  // Obtenir toutes les traductions pour une section
  getSection(section: string): Record<string, any> {
    try {
      return i18n.getResourceBundle(i18n.language, 'translation')[section] || {};
    } catch (error) {
      console.warn(`Translation section error: ${section}`, error);
      return {};
    }
  }
}

export const translationService = new TranslationService();
