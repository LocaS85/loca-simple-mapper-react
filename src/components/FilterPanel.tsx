
import React from 'react';
import { X, Car, User, Bike, Bus } from 'lucide-react';
import { TransportMode } from '@/lib/data/transportModes';
import CategorySelector from './CategorySelector';
import { Category } from '../types';

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
  { id: 'car' as TransportMode, name: 'Voiture', icon: () => <Car size={18} />, color: 'bg-blue-100 text-blue-800' },
  { id: 'walking' as TransportMode, name: 'À pied', icon: () => <User size={18} />, color: 'bg-green-100 text-green-800' },
  { id: 'cycling' as TransportMode, name: 'Vélo', icon: () => <Bike size={18} />, color: 'bg-purple-100 text-purple-800' },
  { id: 'bus' as TransportMode, name: 'Transport', icon: () => <Bus size={18} />, color: 'bg-yellow-100 text-yellow-800' },
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
      <CategorySelector
        categories={[]} // Nous passons un tableau vide car le type CategorySelectorProps attend un tableau de Category
        selectedCategory={selectedCategory}
        onCategorySelect={onCategoryChange}
      />

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
        <div className="grid grid-cols-4 gap-2">
          {transportModes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => onTransportModeChange(mode.id)}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  transportMode === mode.id ? mode.color : 'bg-gray-100'
                } hover:opacity-90 transition-colors`}
              >
                <IconComponent />
                <span className="text-xs mt-1">{mode.name}</span>
              </button>
            );
          })}
        </div>
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
