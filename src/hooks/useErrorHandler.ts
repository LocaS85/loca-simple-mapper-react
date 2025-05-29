
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
      duration: 5000,
    });
  }, [toast]);

  const handleApiError = useCallback((error: Error | unknown, apiName?: string) => {
    console.error(`API Error${apiName ? ` in ${apiName}` : ''}:`, error);
    
    const isNetworkError = error instanceof Error && 
      (error.message.includes('fetch') || error.message.includes('network'));
    
    toast({
      title: isNetworkError ? "Problème de connexion" : "Erreur de l'API",
      description: isNetworkError 
        ? "Vérifiez votre connexion internet et réessayez"
        : "Impossible de récupérer les données. Veuillez réessayer dans quelques instants.",
      variant: "destructive",
      duration: 6000,
    });
  }, [toast]);

  const handleSuccess = useCallback((message: string) => {
    toast({
      title: "Succès",
      description: message,
      variant: "default",
      duration: 4000,
    });
  }, [toast]);

  return { handleError, handleApiError, handleSuccess };
};
