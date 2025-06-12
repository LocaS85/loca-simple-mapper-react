
import React from 'react';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

const MultiMapToggle: React.FC = () => {
  const handleToggle = () => {
    console.log('Toggle multi-map view');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="bg-white shadow-md hover:bg-gray-50"
    >
      <Map className="h-4 w-4" />
    </Button>
  );
};

export default MultiMapToggle;
