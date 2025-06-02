
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { getMapboxToken } from '@/utils/mapboxConfig';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';

interface EnhancedMapboxSearchProps {
  mapRef?: React.RefObject<mapboxgl.Map | null>;
  onResult?: (result: {
    lng: number;
    lat: number;
    place_name: string;
    address?: string;
    context?: any;
  }) => void;
  className?: string;
  placeholder?: string;
  standalone?: boolean; // Si true, le geocoder sera autonome sans map
  proximity?: [number, number]; // Coordonnées pour centrer les résultats
  value?: string;
}

const EnhancedMapboxSearch: React.FC<EnhancedMapboxSearchProps> = ({
  mapRef,
  onResult,
  className = "",
  placeholder,
  standalone = false,
  proximity,
  value
}) => {
  const geocoderContainerRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!geocoderContainerRef.current || isInitialized) return;

    try {
      const token = getMapboxToken();
      if (!token) {
        console.error('Mapbox token manquant');
        return;
      }

      const geocoderOptions: MapboxGeocoder.Options = {
        accessToken: token,
        mapboxgl: mapboxgl,
        placeholder: placeholder || t('map.searchPlaceholder'),
        marker: false,
        language: 'fr',
        countries: 'fr',
        bbox: [-5.559, 41.26, 9.662, 51.312], // France métropolitaine
      };

      // Ajouter la proximité si fournie
      if (proximity) {
        geocoderOptions.proximity = {
          longitude: proximity[0],
          latitude: proximity[1],
        };
      }

      // Créer le geocoder
      geocoderRef.current = new MapboxGeocoder(geocoderOptions);

      // Ajouter au conteneur approprié
      if (standalone && geocoderContainerRef.current) {
        geocoderContainerRef.current.innerHTML = '';
        geocoderRef.current.addTo(geocoderContainerRef.current);
      } else if (mapRef?.current) {
        mapRef.current.addControl(geocoderRef.current);
      } else {
        console.warn('Aucun conteneur valide pour le geocoder');
        return;
      }

      // Gérer les résultats
      geocoderRef.current.on('result', (e: any) => {
        const { center, place_name, properties, context } = e.result;
        const [lng, lat] = center;
        
        // Notifier le parent avec les résultats
        onResult?.({
          lng,
          lat,
          place_name,
          address: properties?.address,
          context
        });
        
        // Si connecté à une carte et non autonome, ajouter un marqueur
        if (mapRef?.current && !standalone) {
          // Retirer le marqueur précédent
          if (markerRef.current) {
            markerRef.current.remove();
          }

          // Créer une popup avec les informations du lieu
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-sm">${place_name.split(',')[0]}</h3>
                <p class="text-xs text-gray-500">${place_name.split(',').slice(1).join(',')}</p>
              </div>
            `);

          // Ajouter un nouveau marqueur
          markerRef.current = new mapboxgl.Marker({ color: "#3B82F6" })
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(mapRef.current);

          // Centrer la carte sur le résultat
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: isMobile ? 14 : 16,
            duration: 1000
          });
        }
      });

      // Gérer les erreurs
      geocoderRef.current.on('error', (err: any) => {
        console.error('Erreur du géocodeur:', err);
      });

      // Gérer l'effacement
      geocoderRef.current.on('clear', () => {
        if (markerRef.current) {
          markerRef.current.remove();
          markerRef.current = null;
        }
      });

      // Initialiser avec une valeur si fournie
      if (value) {
        geocoderRef.current.setInput(value);
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Erreur d\'initialisation du géocodeur:', error);
    }

    // Nettoyer à la destruction
    return () => {
      if (geocoderRef.current) {
        if (mapRef?.current && !standalone) {
          try {
            mapRef.current.removeControl(geocoderRef.current);
          } catch (e) {
            console.warn('Erreur lors du retrait du contrôle geocoder:', e);
          }
        }
        geocoderRef.current = null;
      }
      
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, [mapRef, onResult, isMobile, t, placeholder, standalone, proximity, value, isInitialized]);

  // Mise à jour de la valeur d'entrée si elle change
  useEffect(() => {
    if (value && geocoderRef.current && isInitialized) {
      geocoderRef.current.setInput(value);
    }
  }, [value, isInitialized]);

  return (
    <div
      ref={geocoderContainerRef}
      className={`mapboxgl-ctrl ${className} ${standalone ? 'w-full' : ''}`}
      aria-label={t('map.searchAddress')}
    />
  );
};

export default EnhancedMapboxSearch;
