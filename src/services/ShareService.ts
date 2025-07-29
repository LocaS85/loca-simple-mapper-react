import { GeoSearchFilters, SearchResult } from '@/types/unified';
import { UserPreferences } from './UserPreferencesService';

export interface ShareableSearch {
  id: string;
  filters: GeoSearchFilters;
  results: SearchResult[];
  userLocation: [number, number] | null;
  preferences: Partial<UserPreferences>;
  timestamp: number;
  expiresAt: number;
}

export interface ShareOptions {
  includeResults?: boolean;
  includePreferences?: boolean;
  expirationHours?: number;
  customMessage?: string;
}

class ShareService {
  private readonly BASE_URL = window.location.origin;
  private readonly SHARE_STORAGE_KEY = 'shared_searches';
  private readonly DEFAULT_EXPIRATION_HOURS = 24 * 7; // 7 jours

  // Générer un lien partageable pour une recherche
  async generateShareUrl(
    filters: GeoSearchFilters,
    results: SearchResult[],
    userLocation: [number, number] | null,
    preferences: Partial<UserPreferences>,
    options: ShareOptions = {}
  ): Promise<string> {
    const {
      includeResults = true,
      includePreferences = true,
      expirationHours = this.DEFAULT_EXPIRATION_HOURS,
      customMessage
    } = options;

    // Créer un ID unique pour le partage
    const shareId = this.generateShareId();
    
    // Préparer les données à partager
    const shareData: ShareableSearch = {
      id: shareId,
      filters,
      results: includeResults ? results : [],
      userLocation,
      preferences: includePreferences ? preferences : {},
      timestamp: Date.now(),
      expiresAt: Date.now() + (expirationHours * 60 * 60 * 1000)
    };

    // Stocker les données partagées (dans une vraie app, ce serait sur un serveur)
    this.storeSharedSearch(shareData);

    // Construire l'URL de partage
    const params = new URLSearchParams();
    params.set('share', shareId);
    if (customMessage) {
      params.set('msg', customMessage);
    }

    return `${this.BASE_URL}/geosearch?${params.toString()}`;
  }

  // Générer un lien court pour les paramètres de recherche
  generateQuickShareUrl(filters: GeoSearchFilters, userLocation: [number, number] | null): string {
    const params = new URLSearchParams();
    
    if (filters.category) {
      const categoryValue = Array.isArray(filters.category) ? filters.category[0] : filters.category;
      params.set('category', categoryValue);
    }
    if (filters.subcategory) params.set('subcategory', filters.subcategory);
    if (filters.query) params.set('query', filters.query);
    if (filters.transport) params.set('transport', filters.transport);
    if (filters.distance) params.set('distance', filters.distance.toString());
    if (filters.unit) params.set('unit', filters.unit);
    if (filters.showMultiDirections) params.set('multi', 'true');
    
    if (userLocation) {
      params.set('lat', userLocation[1].toString());
      params.set('lng', userLocation[0].toString());
    }
    
    params.set('autoSearch', 'true');

    return `${this.BASE_URL}/geosearch?${params.toString()}`;
  }

  // Récupérer une recherche partagée
  async getSharedSearch(shareId: string): Promise<ShareableSearch | null> {
    try {
      const stored = localStorage.getItem(this.SHARE_STORAGE_KEY);
      if (!stored) return null;

      const sharedSearches: ShareableSearch[] = JSON.parse(stored);
      const search = sharedSearches.find(s => s.id === shareId);

      if (!search) return null;

      // Vérifier si le partage a expiré
      if (Date.now() > search.expiresAt) {
        this.removeExpiredShares();
        return null;
      }

      return search;
    } catch (error) {
      console.warn('Erreur lors de la récupération du partage:', error);
      return null;
    }
  }

  // Générer des liens pour différentes plateformes
  generatePlatformLinks(shareUrl: string, customMessage?: string): Record<string, string> {
    const encodedUrl = encodeURIComponent(shareUrl);
    const message = customMessage || 'Découvrez cette recherche géographique intéressante !';
    const encodedMessage = encodeURIComponent(message);

    return {
      whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodeURIComponent('Recherche géographique partagée')}&body=${encodedMessage}%20${encodedUrl}`,
      sms: `sms:?body=${encodedMessage}%20${encodedUrl}`
    };
  }

  // Générer un QR code pour le partage mobile
  async generateQRCode(shareUrl: string): Promise<string> {
    // Dans une vraie implémentation, on utiliserait une bibliothèque QR code
    // Pour l'instant, on utilise une API publique
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
    return qrApiUrl;
  }

  // Copier le lien dans le presse-papiers
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'absolute';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.warn('Erreur lors de la copie:', error);
      return false;
    }
  }

  // Générer un ID unique pour le partage
  private generateShareId(): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2);
    return `${timestamp}_${randomStr}`;
  }

  // Stocker une recherche partagée
  private storeSharedSearch(searchData: ShareableSearch): void {
    try {
      const stored = localStorage.getItem(this.SHARE_STORAGE_KEY);
      const sharedSearches: ShareableSearch[] = stored ? JSON.parse(stored) : [];
      
      // Ajouter la nouvelle recherche
      sharedSearches.push(searchData);
      
      // Limiter le nombre de partages stockés (garder les 50 plus récents)
      const limited = sharedSearches
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 50);
      
      localStorage.setItem(this.SHARE_STORAGE_KEY, JSON.stringify(limited));
    } catch (error) {
      console.warn('Erreur lors du stockage du partage:', error);
    }
  }

  // Supprimer les partages expirés
  private removeExpiredShares(): void {
    try {
      const stored = localStorage.getItem(this.SHARE_STORAGE_KEY);
      if (!stored) return;

      const sharedSearches: ShareableSearch[] = JSON.parse(stored);
      const now = Date.now();
      const active = sharedSearches.filter(s => s.expiresAt > now);
      
      localStorage.setItem(this.SHARE_STORAGE_KEY, JSON.stringify(active));
    } catch (error) {
      console.warn('Erreur lors du nettoyage des partages expirés:', error);
    }
  }

  // Obtenir les statistiques de partage
  getShareStats(): {
    totalShares: number;
    activeShares: number;
    expiredShares: number;
  } {
    try {
      const stored = localStorage.getItem(this.SHARE_STORAGE_KEY);
      if (!stored) return { totalShares: 0, activeShares: 0, expiredShares: 0 };

      const sharedSearches: ShareableSearch[] = JSON.parse(stored);
      const now = Date.now();
      
      const activeShares = sharedSearches.filter(s => s.expiresAt > now).length;
      const expiredShares = sharedSearches.length - activeShares;
      
      return {
        totalShares: sharedSearches.length,
        activeShares,
        expiredShares
      };
    } catch (error) {
      console.warn('Erreur lors du calcul des statistiques:', error);
      return { totalShares: 0, activeShares: 0, expiredShares: 0 };
    }
  }

  // Nettoyer complètement le stockage des partages
  clearAllShares(): void {
    localStorage.removeItem(this.SHARE_STORAGE_KEY);
  }
}

export const shareService = new ShareService();
export default shareService;