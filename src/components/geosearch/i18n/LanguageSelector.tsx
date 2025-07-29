import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { useAccessibility } from '../accessibility/AccessibilityProvider';

interface LanguageSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showFlag?: boolean;
  showText?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'ghost',
  size = 'default',
  showFlag = true,
  showText = false
}) => {
  const { currentLanguage, availableLanguages, changeLanguage } = useLanguage();
  const { announceToScreenReader } = useAccessibility();

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = async (languageCode: string) => {
    const newLang = availableLanguages.find(lang => lang.code === languageCode);
    if (newLang) {
      await changeLanguage(newLang.code);
      announceToScreenReader(`Langue changée en ${newLang.nativeName}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className="flex items-center gap-2"
          aria-label={`Langue actuelle: ${currentLang?.nativeName}. Cliquer pour changer`}
        >
          {showFlag && currentLang && (
            <span className="text-lg" role="img" aria-hidden="true">
              {currentLang.flag}
            </span>
          )}
          {!showFlag && <Globe className="h-4 w-4" />}
          {showText && currentLang && (
            <span className="hidden sm:inline">{currentLang.nativeName}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end"
        role="menu"
        aria-label="Sélectionner une langue"
      >
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between gap-3 cursor-pointer"
            role="menuitem"
            aria-current={currentLanguage === language.code ? 'true' : 'false'}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg" role="img" aria-hidden="true">
                {language.flag}
              </span>
              <div>
                <div className="font-medium">{language.nativeName}</div>
                <div className="text-sm text-muted-foreground">{language.name}</div>
              </div>
            </div>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;