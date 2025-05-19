
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Menu, X, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
    <header className="py-2 flex justify-between items-center relative border-b border-gray-100">
      <div>
        <Link to="/" className="text-lg font-bold text-blue-600">LocaSimple</Link>
      </div>

      {/* Mobile burger menu */}
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <button 
              className="p-1 z-20 text-gray-600"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={toggleMenu}
              >
                À propos
              </Link>
              <Link 
                to="/premium" 
                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={toggleMenu}
              >
                Premium
              </Link>
              <Link 
                to="/register" 
                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={toggleMenu}
              >
                S'inscrire
              </Link>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-blue-600 transition-colors py-2"
                onClick={toggleMenu}
              >
                Connexion
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop navigation */}
      {!isMobile && (
        <div className="flex items-center gap-3">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 text-sm",
                  isActive('/') && "text-blue-600 font-medium"
                )}>
                  Accueil
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/geosearch" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 text-sm",
                  isActive('/geosearch') && "text-blue-600 font-medium"
                )}>
                  GeoSearch
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/categories" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 text-sm",
                  isActive('/categories') && "text-blue-600 font-medium"
                )}>
                  Catégories
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/premium" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 text-sm",
                  isActive('/premium') && "text-blue-600 font-medium"
                )}>
                  Premium
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 text-sm",
                  isActive('/about') && "text-blue-600 font-medium"
                )}>
                  À propos
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center ml-3">
            <Link 
              to="/login" 
              className={cn(
                "text-gray-600 hover:text-blue-600 transition-colors px-2 py-1 text-sm flex items-center",
                isActive('/login') && "text-blue-600 font-medium"
              )}
            >
              <User size={16} className="mr-1" />
              <span>Connexion</span>
            </Link>
          </div>
        </div>
      )}

      {/* Mobile navigation overlay - this gets replaced by the Sheet component */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-white z-10 animate-fade-in overflow-auto">
          <div className="flex flex-col items-center justify-start h-full space-y-3 pt-16 pb-16">
            <Link 
              to="/" 
              className={cn(
                "text-base text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Accueil
            </Link>
            <Link 
              to="/geosearch" 
              className={cn(
                "text-base text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/geosearch') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              GeoSearch
            </Link>
            <Link 
              to="/categories" 
              className={cn(
                "text-base text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/categories') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Catégories
            </Link>
            <Link 
              to="/premium" 
              className={cn(
                "text-base text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/premium') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Premium
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "text-base text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/about') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              À propos
            </Link>
            <Link 
              to="/conditions" 
              className={cn(
                "text-base text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/conditions') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              CGU
            </Link>
            <Link 
              to="/confidentialite" 
              className={cn(
                "text-base text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/confidentialite') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Confidentialité
            </Link>
            
            <div className="border-t border-gray-100 w-3/4 my-1"></div>
            
            <Link 
              to="/login" 
              className={cn(
                "text-base text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/login') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Connexion
            </Link>
            <Link 
              to="/register" 
              className={cn(
                "text-base text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/register') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              S'inscrire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
