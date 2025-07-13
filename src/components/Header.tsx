
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
    { path: '/geosearch', key: 'header.geosearch' },
    { path: '/categories', key: 'header.categories' },
    { path: '/premium', key: 'header.premium' },
    { path: '/about', key: 'header.about' }
  ];

  return (
    <header className="py-2 flex justify-between items-center relative border-b border-gray-100">
      <div>
        <Link to="/" className="hover:opacity-80 transition-opacity">
          <Logo size="lg" variant="primary" showText={true} />
        </Link>
      </div>

      {/* Mobile burger menu */}
      {isMobile && (
        <div className="flex items-center">
          <LanguageSelector />
          <Sheet>
            <SheetTrigger asChild>
              <button 
                className="p-1 z-20 text-gray-600 ml-2"
                aria-label={t('common.menu', 'Menu')}
              >
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navigationItems.map((item) => (
                  <Link 
                    key={item.path}
                    to={item.path}
                    className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                    onClick={toggleMenu}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                
                <div className="border-t border-gray-100 w-full my-2"></div>
                
                <Link 
                  to="/auth" 
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={toggleMenu}
                >
                  Se connecter
                </Link>
                <Link 
                  to="/account" 
                  className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                  onClick={toggleMenu}
                >
                  Mon compte
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Desktop navigation */}
      {!isMobile && (
        <div className="flex items-center gap-3">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link 
                    to={item.path} 
                    className={cn(
                      "text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 text-sm",
                      isActive(item.path) && "text-blue-600 font-medium"
                    )}
                  >
                    {t(item.key)}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center gap-2">
            <LanguageSelector />
            
            <div className="flex items-center gap-2">
              <Link 
                to="/auth" 
                className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 text-sm",
                  isActive('/auth') && "text-blue-600 font-medium"
                )}
              >
                Se connecter
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                to="/account" 
                className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 text-sm flex items-center",
                  isActive('/account') && "text-blue-600 font-medium"
                )}
              >
                <User size={16} className="mr-1" />
                <span>Mon compte</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
