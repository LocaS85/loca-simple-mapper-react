
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from './ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Menu, X, User } from 'lucide-react';
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
        <div className="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-3 py-2",
                  isActive('/') && "text-blue-600 font-medium"
                )}>
                  Accueil
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/geo" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-3 py-2",
                  isActive('/geo') && "text-blue-600 font-medium"
                )}>
                  GeoSearch
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/categories" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-3 py-2",
                  isActive('/categories') && "text-blue-600 font-medium"
                )}>
                  Catégories
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/faq" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-3 py-2",
                  isActive('/faq') && "text-blue-600 font-medium"
                )}>
                  F.A.Q.
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-3 py-2",
                  isActive('/about') && "text-blue-600 font-medium"
                )}>
                  À propos
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact" className={cn(
                  "text-gray-600 hover:text-blue-600 transition-colors px-3 py-2",
                  isActive('/contact') && "text-blue-600 font-medium"
                )}>
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center ml-4">
            <Link 
              to="/login" 
              className={cn(
                "text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 flex items-center",
                isActive('/login') && "text-blue-600 font-medium"
              )}
            >
              <User size={18} className="mr-1" />
              <span>Connexion</span>
            </Link>
          </div>
        </div>
      )}

      {/* Mobile navigation overlay */}
      {isMobile && isMenuOpen && (
        <div className="fixed inset-0 bg-white z-10 animate-fade-in overflow-auto">
          <div className="flex flex-col items-center justify-start h-full space-y-4 pt-20 pb-20">
            <Link 
              to="/" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Accueil
            </Link>
            <Link 
              to="/geo" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/geo') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              GeoSearch
            </Link>
            <Link 
              to="/categories" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/categories') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Catégories
            </Link>
            <Link 
              to="/faq" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/faq') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              F.A.Q.
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/about') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              À propos
            </Link>
            <Link 
              to="/contact" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/contact') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Contact
            </Link>
            
            <div className="border-t border-gray-100 w-3/4 my-2"></div>
            
            <Link 
              to="/login" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/login') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Connexion
            </Link>
            <Link 
              to="/register" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/register') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              S'inscrire
            </Link>
            
            <Link 
              to="/account" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/account') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Mon compte
            </Link>
            
            <Link 
              to="/favorites" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/favorites') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Favoris
            </Link>
            
            <Link 
              to="/saved" 
              className={cn(
                "text-lg text-gray-600 hover:text-blue-600 transition-colors py-2 w-full text-center",
                isActive('/saved') && "text-blue-600 font-medium"
              )}
              onClick={toggleMenu}
            >
              Recherches enregistrées
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
