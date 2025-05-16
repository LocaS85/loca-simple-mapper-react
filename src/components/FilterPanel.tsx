import React from 'react';
import { X, Car, User, Bike, Bus } from 'lucide-react';
import { TransportMode } from '@/lib/data/transportModes';
import CategorySelector from './CategorySelector';
import TransportSelector from './TransportSelector';
import { Category } from '../types';
import { categoriesData } from '@/data/categories';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: Category | null;
  onCategoryChange: (category: Category | null) => void;
  transportMode: TransportMode;
  onTransportModeChange: (mode: TransportMode) => void;
  radius: number;
  onRadiusChange: (radius: number) => void;
  maxResults: number;
  onMaxResultsChange: (max: number) => void;
  unit: 'km' | 'mi';
  onUnitChange: (unit: 'km' | 'mi') => void;
}

const transportModes = [
  { id: 'car' as TransportMode, name: 'Voiture', icon: Car, color: '#3b82f6' },
  { id: 'walking' as TransportMode, name: 'À pied', icon: User, color: '#22c55e' },
  { id: 'cycling' as TransportMode, name: 'Vélo', icon: Bike, color: '#8b5cf6' },
  { id: 'bus' as TransportMode, name: 'Transport', icon: Bus, color: '#eab308' },
];

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  transportMode,
  onTransportModeChange,
  radius,
  onRadiusChange,
  maxResults,
  onMaxResultsChange,
  unit,
  onUnitChange,
}) => {
  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Catégorie</h3>
        <CategorySelector
          categories={categoriesData}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategoryChange}
        />
      </div>

      <div>
        <h3 className="font-medium mb-2">Nombre de résultats</h3>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="1"
            max="10"
            value={maxResults}
            onChange={(e) => onMaxResultsChange(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-sm font-medium">{maxResults}</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Rayon de recherche</h3>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="1"
            max={unit === 'km' ? '20' : '12'}
            value={radius}
            onChange={(e) => onRadiusChange(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">{radius}</span>
            <button
              onClick={() => onUnitChange(unit === 'km' ? 'mi' : 'km')}
              className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
            >
              {unit}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Mode de transport</h3>
        <TransportSelector
          transportModes={transportModes.map(mode => ({
            name: mode.name,
            icon: mode.icon,
            color: mode.color
          }))}
          selectedTransport={transportMode}
          onTransportSelect={(modeName) => {
            const mode = transportModes.find(m => m.name === modeName);
            if (mode) onTransportModeChange(mode.id);
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-col w-80 border-l border-gray-200 bg-white overflow-y-auto ${!isOpen && 'hidden'}`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Filtres</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {filterContent}
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">Filtres</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              {filterContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPanel;
