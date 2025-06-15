
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { MapboxError } from '@/components/MapboxError';

export function useMapboxError(setShowTokenSetup: (show: boolean) => void) {
  const { toast } = useToast();

  return useCallback((error: any) => {
    if (error?.message?.includes('token')) {
      setShowTokenSetup(true);
      toast({
        title: 'Clé Mapbox invalide',
        description: "Merci de vérifier votre configuration ou d'ajouter un token valide.",
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Erreur Mapbox',
        description: error?.message || "Erreur inconnue de la carte",
        variant: 'destructive',
      });
    }
  }, [setShowTokenSetup, toast]);
}
