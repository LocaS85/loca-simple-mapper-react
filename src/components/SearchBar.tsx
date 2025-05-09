
import React from 'react';
import { Mic, Crosshair } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onUseMyLocation: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch, onUseMyLocation }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Rechercher un lieu..."
          className="w-full p-2 md:p-3 pl-9 md:pl-10 pr-10 md:pr-12 text-sm md:text-base rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-10 md:right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <button
          onClick={onSearch}
          className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 md:p-1.5 rounded-md hover:bg-blue-700"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      {!isMobile && (
        <>
          <button
            onClick={onUseMyLocation}
            className="p-2 md:p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Utiliser ma position"
          >
            <Crosshair size={isMobile ? 16 : 20} />
          </button>
          <button 
            className="p-2 md:p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Recherche vocale"
          >
            <Mic size={isMobile ? 16 : 20} />
          </button>
        </>
      )}
      {isMobile && (
        <button
          onClick={onUseMyLocation}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          title="Utiliser ma position"
        >
          <Crosshair size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
