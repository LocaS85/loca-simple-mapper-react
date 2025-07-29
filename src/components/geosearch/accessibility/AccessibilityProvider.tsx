import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  keyboardNavigation: boolean;
  screenReaderMode: boolean;
  focusIndicators: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: keyof AccessibilitySettings, value: boolean) => void;
  announceToScreenReader: (message: string) => void;
  focusManagement: {
    trapFocus: (container: HTMLElement) => () => void;
    restoreFocus: (element: HTMLElement | null) => void;
  };
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

const defaultSettings: AccessibilitySettings = {
  reduceMotion: false,
  highContrast: false,
  largeText: false,
  keyboardNavigation: true,
  screenReaderMode: false,
  focusIndicators: true
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [ariaLiveRegion, setAriaLiveRegion] = useState<HTMLElement | null>(null);

  // Détecter les préférences système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    setSettings(prev => ({
      ...prev,
      reduceMotion: mediaQuery.matches,
      highContrast: contrastQuery.matches
    }));

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reduceMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  // Appliquer les styles d'accessibilité
  useEffect(() => {
    const root = document.documentElement;
    
    // Réduction de mouvement
    root.style.setProperty(
      '--motion-duration', 
      settings.reduceMotion ? '0ms' : '300ms'
    );

    // Contraste élevé
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Texte large
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Indicateurs de focus
    if (settings.focusIndicators) {
      root.classList.add('focus-indicators');
    } else {
      root.classList.remove('focus-indicators');
    }

    // Sauvegarder les préférences
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Créer la région live pour les annonces
  useEffect(() => {
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'accessibility-announcements';
    document.body.appendChild(region);
    setAriaLiveRegion(region);

    return () => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    };
  }, []);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const announceToScreenReader = (message: string) => {
    if (ariaLiveRegion) {
      ariaLiveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        if (ariaLiveRegion) {
          ariaLiveRegion.textContent = '';
        }
      }, 1000);
    }
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  const restoreFocus = (element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    announceToScreenReader,
    focusManagement: {
      trapFocus,
      restoreFocus
    }
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility doit être utilisé dans AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider;