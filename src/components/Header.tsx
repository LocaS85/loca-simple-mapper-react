
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <div className="bg-locasimple-blue text-white p-2 rounded-lg mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-800">LocaSimple</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-locasimple-blue">Carte</Link>
          <Link to="/locations" className="text-gray-700 hover:text-locasimple-blue">Locations</Link>
          <Link to="/about" className="text-gray-700 hover:text-locasimple-blue">À propos</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="md:hidden focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          <button className="hidden md:flex items-center bg-locasimple-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Connexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
