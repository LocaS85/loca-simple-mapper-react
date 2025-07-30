import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Share2, 
  Download, 
  Bookmark,
  History,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';
import { useShareUrl } from '@/hooks/useShareUrl';

interface QuickActionsBarProps {
  searchQuery: string;
  filters: any;
  resultsCount: number;
  userLocation: [number, number] | null;
  className?: string;
}

const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  searchQuery,
  filters,
  resultsCount,
  userLocation,
  className = ''
}) => {
  const { generateShareUrl, copyToClipboard } = useShareUrl();

  const handleSaveToFavorites = () => {
    // Logique pour sauvegarder aux favoris
    toast.success("Recherche ajoutée aux favoris");
  };

  const handleShareSearch = async () => {
    try {
      const shareUrl = await generateShareUrl({
        includeResults: true,
        includePreferences: false,
        customMessage: `Recherche: ${searchQuery}`
      });
      await copyToClipboard(shareUrl);
      toast.success("Lien de recherche copié");
    } catch (error) {
      toast.error("Erreur lors du partage");
    }
  };

  const handleSaveSearch = () => {
    // Sauvegarder en localStorage pour l'historique
    const searchData = {
      id: Date.now().toString(),
      query: searchQuery,
      filters,
      location: userLocation,
      timestamp: new Date().toISOString(),
      resultsCount
    };
    
    const existingHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const updatedHistory = [searchData, ...existingHistory.slice(0, 49)]; // Garder max 50 éléments
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    
    toast.success("Recherche sauvegardée");
  };

  const handleExportResults = () => {
    // Logique pour exporter les résultats (PDF, etc.)
    toast.info("Export des résultats en cours...");
  };

  const handleCreateRoute = () => {
    // Logique pour créer un itinéraire
    toast.info("Création d'itinéraire...");
  };

  return (
    <div className={`flex items-center gap-2 p-2 bg-background/50 backdrop-blur-sm border rounded-lg ${className}`}>
      {/* Indicateur de résultats */}
      {resultsCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          {resultsCount} résultat{resultsCount > 1 ? 's' : ''}
        </Badge>
      )}

      {/* Actions rapides */}
      <div className="flex items-center gap-1 ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSaveToFavorites}
          title="Ajouter aux favoris"
          className="h-8 w-8 p-0"
        >
          <Heart className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSaveSearch}
          title="Sauvegarder cette recherche"
          className="h-8 w-8 p-0"
        >
          <Bookmark className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleShareSearch}
          title="Partager la recherche"
          className="h-8 w-8 p-0"
        >
          <Share2 className="h-4 w-4" />
        </Button>

        {resultsCount > 0 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportResults}
              title="Exporter les résultats"
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateRoute}
              title="Créer un itinéraire"
              className="h-8 w-8 p-0"
            >
              <Navigation className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickActionsBar;