
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="py-4 flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold text-blue-600">LocaSimple</Link>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">Accueil</Link>
          </li>
          <li>
            <Link to="/geo" className="text-gray-600 hover:text-blue-600 transition-colors">GeoSearch</Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">À propos</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
