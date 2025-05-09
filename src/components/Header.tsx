
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-4 flex justify-between items-center relative">
      <div>
        <Link to="/" className="text-xl font-bold text-blue-600">LocaSimple</Link>
      </div>

      {/* Mobile menu button */}
      {isMobile && (
        <button 
          onClick={toggleMenu} 
          className="p-2 z-20 text-gray-600"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Desktop navigation */}
      {!isMobile && (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={cn(
                "text-gray-600 hover:text-blue-600 transition-colors px-4 py-2",
                isActive('/') && "text-blue-600 font-medium"
              )}>
                Accueil
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/geo" className={cn(
                "text-gray-600 hover:text-blue-600 transition-colors px-4 py-2",
                isActive('/geo') && "text-blue-600 font-medium"
              )}>
                GeoSearch
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about" className={cn(
                "text-gray-600 hover:text-blue-600 transition-colors px-4 py-2",
                isActive('/about') && "text-blue-600 font-medium"
              )}>
                À propos
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}

      {/* Mobile navigation overlay */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-white z-10 animate-fade-in">
          <div className="flex flex-col items-center justify-center h-full space-y-6 pt-16">
            <Link 
              to="/" 
              className={cn(
                "text-xl text-gray-600 hover:text-blue-600 transition-colors py-2",
                isActive('/') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Accueil
            </Link>
            <Link 
              to="/geo" 
              className={cn(
                "text-xl text-gray-600 hover:text-blue-600 transition-colors py-2",
                isActive('/geo') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              GeoSearch
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "text-xl text-gray-600 hover:text-blue-600 transition-colors py-2",
                isActive('/about') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              À propos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
