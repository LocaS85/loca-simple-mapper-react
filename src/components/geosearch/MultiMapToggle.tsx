
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Maximize, Minimize } from 'lucide-react';
import { cn } from '@/lib/utils';
import mapboxgl from 'mapbox-gl';
import { getMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';
import { useGeoSearch } from '@/hooks/use-geo-search';
import { useTranslation } from 'react-i18next';

const MultiMapToggle: React.FC = () => {
  const [isMultiView, setIsMultiView] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const miniMapRef = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<mapboxgl.Map | null>(null);
  const { userLocation, results } = useGeoSearch({});
  const { t } = useTranslation();

  const toggleMultiView = () => {
    setIsMultiView(prev => !prev);
  };

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  // Initialize mini map when component mounts or when visibility changes
  useEffect(() => {
    if (!isMultiView || !miniMapRef.current || !userLocation) return;
    
    if (!isMapboxTokenValid()) {
      console.error('Invalid Mapbox token');
      return;
    }
    
    const mapboxToken = getMapboxToken();
    mapboxgl.accessToken = mapboxToken;
    
    try {
      if (map.current) {
        map.current.remove();
      }
      
      map.current = new mapboxgl.Map({
        container: miniMapRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: userLocation,
        zoom: 9,
        attributionControl: false,
        interactive: isExpanded // Only allow interaction when expanded
      });
      
      // Add markers for user location and results
      new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat(userLocation)
        .addTo(map.current);
      
      // Add result markers if available
      results.forEach(result => {
        new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat(result.coordinates)
          .addTo(map.current!);
      });
      
      if (isExpanded) {
        map.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
      }
      
      // Fit bounds to include all markers if there are results
      if (results.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(userLocation);
        results.forEach(result => bounds.extend(result.coordinates));
        
        map.current.fitBounds(bounds, {
          padding: 30,
          maxZoom: 14
        });
      }
    } catch (error) {
      console.error('Error initializing mini map:', error);
    }
    
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isMultiView, isExpanded, userLocation, results]);

  return (
    <div className="fixed bottom-20 right-4 z-10 flex flex-col gap-2">
      <Button
        variant="secondary"
        size="icon"
        className="bg-white shadow-md hover:bg-gray-100"
        onClick={toggleMultiView}
        title={t('map.miniMap')}
      >
        <LayoutGrid className="h-5 w-5 text-gray-700" />
      </Button>
      
      {isMultiView && (
        <Button
          variant="secondary"
          size="icon"
          className="bg-white shadow-md hover:bg-gray-100"
          onClick={toggleExpand}
          title={isExpanded ? t('map.collapseMap') : t('map.expandMap')}
        >
          {isExpanded ? (
            <Minimize className="h-5 w-5 text-gray-700" />
          ) : (
            <Maximize className="h-5 w-5 text-gray-700" />
          )}
        </Button>
      )}
      
      {/* Mini map container that would appear in multi-view mode */}
      {isMultiView && (
        <div className={cn(
          "fixed bottom-20 right-4 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300",
          isExpanded ? "w-96 h-64 sm:w-[450px] sm:h-80" : "w-32 h-32"
        )}>
          <div ref={miniMapRef} className="w-full h-full bg-gray-200">
            {!userLocation && (
              <div className="flex items-center justify-center h-full">
                <span className="text-xs text-gray-500">{t('geosearch.miniMapTitle')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiMapToggle;
