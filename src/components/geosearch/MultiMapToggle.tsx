
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Map, Route } from 'lucide-react';
import { useGeoSearchStore } from '@/store/geoSearchStore';

const STORAGE_KEY = 'geoSearch_showMultiDirections';

const MultiMapToggle: React.FC = () => {
  const { filters, updateFilters } = useGeoSearchStore();
  
  // Charger la préférence depuis localStorage au montage
  useEffect(() => {
    const savedPreference = localStorage.getItem(STORAGE_KEY);
    if (savedPreference !== null) {
      const isEnabled = JSON.parse(savedPreference);
      if (isEnabled !== filters.showMultiDirections) {
        updateFilters({ showMultiDirections: isEnabled });
      }
    }
  }, []);

  // Sauvegarder la préférence dans localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters.showMultiDirections));
  }, [filters.showMultiDirections]);
  
  const handleToggle = () => {
    updateFilters({ showMultiDirections: !filters.showMultiDirections });
  };

  const tooltipText = filters.showMultiDirections 
    ? "Masquer les tracés multiples - Affiche seulement l'itinéraire principal"
    : "Afficher les tracés multiples - Calcule tous les itinéraires possibles";

  return (
    <Button
      variant={filters.showMultiDirections ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      className="bg-white shadow-md hover:bg-gray-50 gap-2 transition-all duration-200 hover:scale-105"
      title={tooltipText}
    >
      {filters.showMultiDirections ? (
        <Route className="h-4 w-4 text-white" />
      ) : (
        <Map className="h-4 w-4" />
      )}
      <span className={filters.showMultiDirections ? "text-white" : ""}>
        {filters.showMultiDirections ? "Multi" : "Simple"}
      </span>
    </Button>
  );
};

export default MultiMapToggle;
