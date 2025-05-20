
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Obtenir la langue actuelle
  const currentLanguage = i18n.language;
  
  // Configuration des langues
  const languages = [
    { code: 'fr', name: t('language.fr') },
    { code: 'en', name: t('language.en') },
    { code: 'es', name: t('language.es') },
    { code: 'de', name: t('language.de') }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Globe size={16} />
          <span className="hidden md:inline ml-1">
            {languages.find(lang => lang.code === currentLanguage)?.name || t('language.fr')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={currentLanguage === language.code ? "bg-muted" : ""}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
