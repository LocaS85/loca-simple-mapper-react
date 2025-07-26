
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, Route } from 'lucide-react';
import { useGeoSearchStore } from '@/store/geoSearchStore';

const MultiMapToggle: React.FC = () => {
  const { filters, updateFilters } = useGeoSearchStore();
  
  const handleToggle = () => {
    updateFilters({ showMultiDirections: !filters.showMultiDirections });
  };

  return (
    <Button
      variant={filters.showMultiDirections ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      className="bg-white shadow-md hover:bg-gray-50 gap-2"
      title={filters.showMultiDirections ? "Masquer les tracés multiples" : "Afficher les tracés multiples"}
    >
      {filters.showMultiDirections ? <Route className="h-4 w-4" /> : <Map className="h-4 w-4" />}
      {filters.showMultiDirections ? "Multi" : "Simple"}
    </Button>
  );
};

export default MultiMapToggle;
