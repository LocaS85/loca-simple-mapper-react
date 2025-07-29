import { useState, useCallback } from 'react';
import { shareService, ShareOptions } from '@/services/ShareService';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useUserPreferences } from './useUserPreferences';
import { useToast } from './use-toast';

export const useShareUrl = () => {
  const { toast } = useToast();
  const { filters, results, userLocation } = useGeoSearchStore();
  const { preferences } = useUserPreferences();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const generateShareUrl = useCallback(async (options: ShareOptions = {}) => {
    setIsGenerating(true);
    try {
      const url = await shareService.generateShareUrl(
        filters,
        results,
        userLocation,
        preferences,
        options
      );
      
      setShareUrl(url);
      
      // Générer aussi le QR code
      const qrUrl = await shareService.generateQRCode(url);
      setQrCodeUrl(qrUrl);
      
      return url;
    } catch (error) {
      console.error('Erreur lors de la génération du lien:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le lien de partage",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [filters, results, userLocation, preferences, toast]);

  const generateQuickUrl = useCallback(() => {
    const url = shareService.generateQuickShareUrl(filters, userLocation);
    setShareUrl(url);
    return url;
  }, [filters, userLocation]);

  const copyToClipboard = useCallback(async (url?: string) => {
    const urlToCopy = url || shareUrl;
    if (!urlToCopy) return false;
    
    const success = await shareService.copyToClipboard(urlToCopy);
    if (success) {
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans le presse-papiers"
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
    return success;
  }, [shareUrl, toast]);

  const getPlatformLinks = useCallback((customMessage?: string) => {
    if (!shareUrl) return {};
    return shareService.generatePlatformLinks(shareUrl, customMessage);
  }, [shareUrl]);

  const reset = useCallback(() => {
    setShareUrl(null);
    setQrCodeUrl(null);
  }, []);

  return {
    shareUrl,
    qrCodeUrl,
    isGenerating,
    generateShareUrl,
    generateQuickUrl,
    copyToClipboard,
    getPlatformLinks,
    reset
  };
};