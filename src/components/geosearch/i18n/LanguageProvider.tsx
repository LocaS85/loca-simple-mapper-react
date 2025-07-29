import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type SupportedLanguage = 'fr' | 'en' | 'es' | 'de';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  availableLanguages: Array<{
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    flag: string;
  }>;
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  isRTL: boolean;
  formatNumber: (num: number) => string;
  formatDistance: (distance: number, unit?: 'km' | 'mi') => string;
  formatDuration: (minutes: number) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const languages = [
  { code: 'fr' as const, name: 'Français', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'en' as const, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es' as const, name: 'Español', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de' as const, name: 'Deutsch', nativeName: 'Deutsch', flag: '🇩🇪' }
];

const rtlLanguages: SupportedLanguage[] = []; // Aucune langue RTL dans cette liste pour l'instant

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('preferred-language');
    return (saved as SupportedLanguage) || 'fr';
  });

  const isRTL = rtlLanguages.includes(currentLanguage);

  useEffect(() => {
    // Appliquer la direction du texte
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  const changeLanguage = async (language: SupportedLanguage) => {
    try {
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      localStorage.setItem('preferred-language', language);
      
      // Annoncer le changement aux lecteurs d'écran
      const announcement = `Langue changée en ${languages.find(l => l.code === language)?.nativeName}`;
      const ariaLive = document.getElementById('accessibility-announcements');
      if (ariaLive) {
        ariaLive.textContent = announcement;
      }
    } catch (error) {
      console.error('Erreur changement de langue:', error);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(currentLanguage).format(num);
  };

  const formatDistance = (distance: number, unit: 'km' | 'mi' = 'km'): string => {
    const formatter = new Intl.NumberFormat(currentLanguage, {
      style: 'unit',
      unit: unit === 'km' ? 'kilometer' : 'mile',
      unitDisplay: 'short',
      maximumFractionDigits: 1
    });
    
    if (unit === 'km') {
      return distance < 1000 
        ? `${Math.round(distance)} m`
        : formatter.format(distance / 1000);
    }
    
    const miles = distance * 0.000621371;
    return miles < 1
      ? `${Math.round(distance * 3.28084)} ft`
      : formatter.format(miles);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
      return new Intl.RelativeTimeFormat(currentLanguage, { 
        style: 'short', 
        numeric: 'always' 
      }).format(hours, 'hour') + 
      (mins > 0 ? ` ${mins} min` : '');
    }
    
    return `${mins} min`;
  };

  const contextValue: LanguageContextType = {
    currentLanguage,
    availableLanguages: languages,
    changeLanguage,
    isRTL,
    formatNumber,
    formatDistance,
    formatDuration
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage doit être utilisé dans LanguageProvider');
  }
  return context;
};

export default LanguageProvider;