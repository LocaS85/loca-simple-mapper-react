import React, { useEffect, useRef } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';
import { useGeoSearch } from '@/hooks/geosearch/useGeoSearch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface EnhancedGeoSearchControllerProps {
  children: React.ReactNode;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWF6Z3A1Ym4waXN6MmtzYzh4bWZ2YWIxIn0.tbWmkuCSJw4h_Ol1Q6ed0A';

const EnhancedGeoSearchController: React.FC<EnhancedGeoSearchControllerProps> = ({ children }) => {
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
  const { updateFiltersWithSearch, setFiltersFromParams } = useGeoSearch();

  useEffect(() => {
    if (!MAPBOX_TOKEN || typeof window === 'undefined') {
      console.warn('Token Mapbox manquant ou environnement serveur');
      return;
    }

    try {
      // Initialiser le geocoder Mapbox
      const geocoder = new MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        mapboxgl,
        placeholder: 'Rechercher un lieu, une adresse...',
        countries: 'fr',
        language: 'fr',
        types: 'place,poi,address,neighborhood',
        bbox: [-5.5, 41.0, 9.5, 51.5], // Bounding box pour la France
        proximity: {
          longitude: 2.3522,
          latitude: 48.8566
        },
        marker: false,
        flyTo: false
      });

      geocoderRef.current = geocoder;

      // Ajouter le geocoder au container
      const inputContainer = document.getElementById('geocoder-container');
      if (inputContainer) {
        inputContainer.innerHTML = '';
        inputContainer.appendChild(geocoder.onAdd(new mapboxgl.Map({
          container: document.createElement('div'),
          style: 'mapbox://styles/mapbox/light-v11'
        })));
      }

      // Gérer la sélection de résultat
      geocoder.on('result', (e) => {
        console.log('🔍 Résultat de recherche sélectionné:', e.result);
        
        const coords = e.result.center as [number, number];
        const query = e.result.text || e.result.place_name;
        
        // Mettre à jour les filtres avec les nouvelles coordonnées et la requête
        updateFiltersWithSearch({
          query,
          coordinates: coords
        });
      });

      // Gérer les erreurs de géocodage
      geocoder.on('error', (e) => {
        console.error('❌ Erreur de géocodage:', e.error);
      });

      return () => {
        if (geocoderRef.current) {
          geocoderRef.current.clear();
        }
      };

    } catch (error) {
      console.error('❌ Erreur d\'initialisation du geocoder:', error);
    }
  }, [updateFiltersWithSearch]);

  // Initialiser les filtres depuis les paramètres URL au montage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params: Record<string, string> = {};
    
    urlParams.forEach((value, key) => {
      params[key] = value;
    });
    
    if (Object.keys(params).length > 0) {
      setFiltersFromParams(params);
    }
  }, [setFiltersFromParams]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Token Mapbox manquant. Veuillez configurer VITE_MAPBOX_TOKEN dans les variables d'environnement.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="enhanced-geo-search-controller">
      {children}
    </div>
  );
};

export default EnhancedGeoSearchController;
