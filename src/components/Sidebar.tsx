
import React from 'react';
import { Location } from '@/types/unified';
import LocationCard from './LocationCard';

interface SidebarProps {
  locations: Location[];
  selectedLocationId?: string;
  onSelectLocation: (locationId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  locations,
  selectedLocationId,
  onSelectLocation
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-white shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Emplacements</h2>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-locasimple-blue"
          />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {locations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-gray-400">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <p>Aucun emplacement trouvé</p>
          </div>
        ) : (
          locations.map(location => (
            <LocationCard
              key={location.id}
              location={location}
              isSelected={selectedLocationId === location.id}
              onClick={() => onSelectLocation(location.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
