
import { useCallback } from 'react';
import { useToast } from './use-toast';

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((error: Error | unknown, context?: string) => {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
    
    const message = error instanceof Error ? error.message : 'Une erreur inattendue s\'est produite';
    
    toast({
      title: "Erreur",
      description: message,
      variant: "destructive",
    });
  }, [toast]);

  const handleApiError = useCallback((error: Error | unknown, apiName?: string) => {
    console.error(`API Error${apiName ? ` in ${apiName}` : ''}:`, error);
    
    toast({
      title: "Erreur de connexion",
      description: "Impossible de récupérer les données. Veuillez réessayer.",
      variant: "destructive",
    });
  }, [toast]);

  return { handleError, handleApiError };
};
