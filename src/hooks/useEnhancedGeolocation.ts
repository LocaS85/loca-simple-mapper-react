import { useState, useCallback, useRef } from 'react';
import { enhancedGeolocationService } from '@/services/geolocation/EnhancedGeolocationService';
import { CoordinatesPair } from '@/types/unified';
import { useToast } from '@/hooks/use-toast';

interface GeolocationState {
  coordinates: CoordinatesPair | null;
  accuracy: number | null;
  source: 'gps' | 'network' | 'ip' | 'manual' | null;
  quality: number;
  isLoading: boolean;
  error: string | null;
  context?: {
    city?: string;
    country?: string;
    timezone?: string;
  };
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  fallbackToIP?: boolean;
  requireHighQuality?: boolean;
  autoRequest?: boolean;
}

export const useEnhancedGeolocation = (options: GeolocationOptions = {}) => {
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    accuracy: null,
    source: null,
    quality: 0,
    isLoading: false,
    error: null
  });

  const requestLocation = useCallback(async () => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      console.log('🌍 Demande géolocalisation avancée...');
      
      const location = await enhancedGeolocationService.getCurrentPosition({
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 15000,
        maximumAge: options.maximumAge ?? 300000,
        fallbackToIP: options.fallbackToIP ?? true,
        requireHighQuality: options.requireHighQuality ?? false
      });

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setState({
        coordinates: location.coordinates,
        accuracy: location.accuracy,
        source: location.source,
        quality: location.quality,
        isLoading: false,
        error: null,
        context: location.context
      });

      // Show success toast with location info
      const locationInfo = location.context?.city 
        ? `${location.context.city}, ${location.context.country}`
        : `Précision: ${Math.round(location.accuracy)}m`;
        
      toast({
        title: "Position détectée",
        description: `${locationInfo} (${location.source.toUpperCase()})`,
        duration: 3000
      });

      console.log(`✅ Géolocalisation réussie: ${location.source}, qualité: ${location.quality}%`);

    } catch (error) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const errorMessage = error instanceof Error ? error.message : 'Erreur géolocalisation inconnue';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast({
        title: "Erreur de géolocalisation",
        description: errorMessage,
        variant: "destructive",
        duration: 5000
      });

      console.error('❌ Erreur géolocalisation avancée:', error);
    }
  }, [options, toast]);

  const getCurrentLocation = useCallback(() => {
    return enhancedGeolocationService.getCurrentLocation();
  }, []);

  const getLocationHistory = useCallback(() => {
    return enhancedGeolocationService.getLocationHistory();
  }, []);

  const getQualityStats = useCallback(() => {
    return enhancedGeolocationService.getLocationQualityStats();
  }, []);

  const clearHistory = useCallback(() => {
    enhancedGeolocationService.clearHistory();
    toast({
      title: "Historique vidé",
      description: "L'historique de géolocalisation a été supprimé",
      duration: 2000
    });
  }, [toast]);

  const setManualLocation = useCallback((coordinates: CoordinatesPair) => {
    setState(prev => ({
      ...prev,
      coordinates,
      accuracy: null,
      source: 'manual',
      quality: 50,
      error: null
    }));

    toast({
      title: "Position définie manuellement",
      description: `Lat: ${coordinates[1].toFixed(4)}, Lng: ${coordinates[0].toFixed(4)}`,
      duration: 3000
    });
  }, [toast]);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  }, []);

  // Auto-request on mount if enabled
  useState(() => {
    if (options.autoRequest) {
      requestLocation();
    }
  });

  return {
    // State
    coordinates: state.coordinates,
    accuracy: state.accuracy,
    source: state.source,
    quality: state.quality,
    isLoading: state.isLoading,
    error: state.error,
    context: state.context,
    
    // Actions
    requestLocation,
    setManualLocation,
    cancelRequest,
    
    // History and stats
    getCurrentLocation,
    getLocationHistory,
    getQualityStats,
    clearHistory,
    
    // Computed properties
    isHighQuality: state.quality >= 70,
    isReliable: state.quality >= 50 && state.error === null,
    hasContext: !!state.context?.city
  };
};