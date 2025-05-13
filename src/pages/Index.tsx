
import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import { Location } from '../types';
import { useToast } from "@/hooks/use-toast";

// Sample data - normally this would come from an API
const sampleLocations: Location[] = [
  {
    id: '1',
    name: 'Appartement au centre de Paris',
    address: '15 Rue de Rivoli, 75004 Paris',
    description: 'Magnifique appartement avec vue sur la Seine, proche des attractions touristiques et des transports en commun.',
    price: 1200,
    coordinates: [2.3522, 48.8566],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    name: 'Studio à Montmartre',
    address: '25 Rue des Abbesses, 75018 Paris',
    description: 'Charmant studio au cœur de Montmartre, à quelques pas du Sacré-Cœur et de la Place du Tertre.',
    price: 950,
    coordinates: [2.3378, 48.8865],
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    name: 'Loft dans le Marais',
    address: '10 Rue des Archives, 75004 Paris',
    description: 'Spacieux loft dans le quartier historique du Marais, rénové avec des finitions modernes et élégantes.',
    price: 1500,
    coordinates: [2.3582, 48.8566],
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const Index = () => {
  const [locations] = useState<Location[]>(sampleLocations);
  const [selectedLocationId, setSelectedLocationId] = useState<string | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Index page loaded");
    
    // Show toast to confirm the page is loaded
    toast({
      title: "Bienvenue",
      description: "Application de cartographie chargée avec succès",
    });
  }, [toast]);

  const handleSelectLocation = (locationId: string) => {
    setSelectedLocationId(locationId);
    console.log("Selected location:", locationId);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex flex-grow relative">
        {/* Sidebar toggle button for mobile */}
        <button 
          className="md:hidden fixed top-20 left-4 z-10 bg-white p-2 rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {sidebarOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </>
            )}
          </svg>
        </button>
        
        {/* Sidebar */}
        <div 
          className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 transform transition-transform duration-300 ease-in-out
            fixed md:relative z-20 md:z-0 md:w-96 w-3/4 h-full bg-white
          `}
        >
          <Sidebar 
            locations={locations}
            selectedLocationId={selectedLocationId}
            onSelectLocation={handleSelectLocation}
          />
        </div>
        
        {/* Map */}
        <div className="flex-grow relative">
          <Map 
            locations={locations}
            selectedLocationId={selectedLocationId}
            onSelectLocation={handleSelectLocation}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
