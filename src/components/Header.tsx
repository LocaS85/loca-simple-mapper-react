
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Menu, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslations } from '@/hooks/useTranslations';
import LanguageSelector from './LanguageSelector';
import Logo from './ui/Logo';

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslations();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationItems = [
    { path: '/', key: 'header.home' },
    { path: '/recherche', key: 'header.search' },
    { path: '/categories', key: 'header.categories' },
    { path: '/about', key: 'header.about' },
    { path: '/premium', key: 'header.premium' },
    { path: '/contact', key: 'Contact' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-locasimple-teal bg-clip-text text-transparent">
            LocaSimple
          </h1>
        </div>

        {/* Mobile burger menu */}
        {isMobile && (
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <Sheet>
              <SheetTrigger asChild>
                <button 
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label={t('common.menu', 'Menu')}
                >
                  <Menu size={24} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <div className="flex flex-col h-full">
                  {/* Titre dans le menu */}
                  <div className="flex items-center mb-8 pt-4">
                    <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-locasimple-teal bg-clip-text text-transparent">
                      LocaSimple
                    </h2>
                  </div>

                  <nav className="flex flex-col space-y-1">
                    {navigationItems.map((item) => (
                      <Link 
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-lg transition-colors",
                          isActive(item.path) 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "hover:bg-muted"
                        )}
                        onClick={toggleMenu}
                      >
                        {t(item.key)}
                      </Link>
                    ))}
                    
                    <div className="border-t border-border my-4"></div>
                    
                    <Link 
                      to="/auth" 
                      className="flex items-center px-4 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
                      onClick={toggleMenu}
                    >
                      Se connecter
                    </Link>
                    <Link 
                      to="/auth" 
                      className="flex items-center px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-colors"
                      onClick={toggleMenu}
                    >
                      S'inscrire
                    </Link>
                    <Link 
                      to="/account" 
                      className="flex items-center px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={toggleMenu}
                    >
                      <User size={18} className="mr-3" />
                      Mon compte
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Desktop navigation */}
        {!isMobile && (
          <div className="flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link 
                      to={item.path} 
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.path) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t(item.key)}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            <div className="flex items-center space-x-3">
              <LanguageSelector />
              
              <div className="flex items-center space-x-2">
                <Link 
                  to="/auth" 
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Se connecter
                </Link>
                <Link 
                  to="/auth" 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  S'inscrire
                </Link>
                <Link 
                  to="/account" 
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1",
                    isActive('/account') 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <User size={16} />
                  <span>Mon compte</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
