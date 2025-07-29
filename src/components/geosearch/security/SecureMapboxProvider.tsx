import React, { createContext, useContext, useEffect, useState } from 'react';
import { secureMapboxProxy } from '@/services/secureMapboxProxy';
import { tokenValidator, TokenValidationResult } from '@/services/tokenValidator';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundaryRobust from './ErrorBoundaryRobust';

interface SecureMapboxContextType {
  isReady: boolean;
  tokenStatus: TokenValidationResult | null;
  geocode: (query: string, proximity?: [number, number]) => Promise<any>;
  directions: (coordinates: number[][], profile?: string) => Promise<any>;
  isochrone: (center: [number, number], profile: string, duration: number) => Promise<any>;
  clearCache: () => void;
  refreshToken: () => Promise<void>;
}

const SecureMapboxContext = createContext<SecureMapboxContextType | null>(null);

interface SecureMapboxProviderProps {
  children: React.ReactNode;
}

export const SecureMapboxProvider: React.FC<SecureMapboxProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<TokenValidationResult | null>(null);
  const { toast } = useToast();

  const validateCurrentToken = async () => {
    try {
      const token = localStorage.getItem('MAPBOX_ACCESS_TOKEN') || 
                   (window as any).MAPBOX_ACCESS_TOKEN;
      
      if (!token) {
        setTokenStatus({ isValid: false, type: 'invalid' });
        setIsReady(false);
        return;
      }

      const validation = await tokenValidator.validateToken(token);
      setTokenStatus(validation);
      
      if (validation.isValid) {
        setIsReady(true);
        
        // Check if token needs rotation
        if (tokenValidator.shouldRotateToken(validation)) {
          toast({
            title: "Token usage élevé",
            description: "Considérez renouveler votre token Mapbox",
            variant: "default",
          });
        }
        
        // Check if token is expired
        if (tokenValidator.isTokenExpired(validation)) {
          toast({
            title: "Token expiré",
            description: "Votre token Mapbox a expiré",
            variant: "destructive",
          });
          setIsReady(false);
        }
      } else {
        setIsReady(false);
        toast({
          title: "Token invalide",
          description: "Le token Mapbox n'est pas valide",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Erreur validation token:', error);
      setIsReady(false);
      toast({
        title: "Erreur de validation",
        description: "Impossible de valider le token Mapbox",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    validateCurrentToken();
    
    // Re-validate every 30 minutes
    const interval = setInterval(validateCurrentToken, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const geocode = async (query: string, proximity?: [number, number]) => {
    if (!isReady) {
      throw new Error('Service Mapbox non prêt');
    }
    return secureMapboxProxy.geocode(query, proximity);
  };

  const directions = async (coordinates: number[][], profile: string = 'driving') => {
    if (!isReady) {
      throw new Error('Service Mapbox non prêt');
    }
    return secureMapboxProxy.directions(coordinates, profile);
  };

  const isochrone = async (center: [number, number], profile: string, duration: number) => {
    if (!isReady) {
      throw new Error('Service Mapbox non prêt');
    }
    return secureMapboxProxy.isochrone(center, profile, duration);
  };

  const clearCache = () => {
    secureMapboxProxy.clearCache();
    tokenValidator.clearCache();
    toast({
      title: "Cache vidé",
      description: "Le cache Mapbox a été vidé avec succès",
      variant: "default",
    });
  };

  const refreshToken = async () => {
    await validateCurrentToken();
  };

  const contextValue: SecureMapboxContextType = {
    isReady,
    tokenStatus,
    geocode,
    directions,
    isochrone,
    clearCache,
    refreshToken
  };

  return (
    <ErrorBoundaryRobust>
      <SecureMapboxContext.Provider value={contextValue}>
        {children}
      </SecureMapboxContext.Provider>
    </ErrorBoundaryRobust>
  );
};

export const useSecureMapbox = () => {
  const context = useContext(SecureMapboxContext);
  if (!context) {
    throw new Error('useSecureMapbox doit être utilisé dans SecureMapboxProvider');
  }
  return context;
};

export default SecureMapboxProvider;