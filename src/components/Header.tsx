
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from './ui/navigation-menu';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="py-4 flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold text-blue-600">LocaSimple</Link>
      </div>
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
    </header>
  );
};

export default Header;
