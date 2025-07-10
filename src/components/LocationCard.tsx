
import React from 'react';
import { Location } from '@/types/unified';

interface LocationCardProps {
  location: Location;
  isSelected?: boolean;
  onClick?: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, isSelected = false, onClick }) => {
  return (
    <div 
      className={`
        rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-all duration-200
        ${isSelected ? 'ring-2 ring-locasimple-blue scale-[1.02]' : 'hover:shadow-lg hover:scale-[1.01]'}
      `}
      onClick={onClick}
    >
      <div className="relative h-40 bg-gray-200">
        {location.image ? (
          <img 
            src={location.image} 
            alt={location.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}
        {location.price !== undefined && (
          <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md text-sm font-medium shadow-sm">
            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(location.price)}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white">
        <h3 className="font-medium text-gray-900">{location.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{location.address}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{location.description}</p>
      </div>
    </div>
  );
};

export default LocationCard;
