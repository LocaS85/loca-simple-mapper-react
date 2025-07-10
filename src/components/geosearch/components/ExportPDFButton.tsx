import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Map, List, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { SearchResult } from '@/types/geosearch';
import { exportToPDF, exportResultsListToPDF, isPDFExportSupported } from '@/utils/pdfExport';
import { useToast } from '@/hooks/use-toast';

interface ExportPDFButtonProps {
  results: SearchResult[];
  userLocation?: [number, number] | null;
  filters?: {
    query?: string;
    category?: string;
    distance?: number;
    transport?: string;
  };
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
  results,
  userLocation,
  filters,
  variant = 'outline',
  size = 'default',
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleExport = async (type: 'complete' | 'map' | 'results') => {
    if (!isPDFExportSupported()) {
      toast({
        title: "Export non supporté",
        description: "L'export PDF n'est pas supporté par votre navigateur.",
        variant: "destructive"
      });
      return;
    }

    if (results.length === 0 && type !== 'map') {
      toast({
        title: "Aucun résultat",
        description: "Aucun résultat à exporter. Effectuez d'abord une recherche.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    
    try {
      const exportData = {
        results,
        userLocation,
        transport: filters?.transport as any,
        filters: {
          category: filters?.category,
          distance: filters?.distance,
          query: filters?.query
        }
      };

      switch (type) {
        case 'complete':
          await exportToPDF(exportData, {
            title: 'Recherche GeoSearch - Rapport complet',
            includeMap: true,
            includeResults: true,
            mapElementId: 'google-maps-container'
          });
          break;
          
        case 'map':
          await exportToPDF(exportData, {
            title: 'Carte GeoSearch',
            includeMap: true,
            includeResults: false,
            mapElementId: 'google-maps-container'
          });
          break;
          
        case 'results':
          await exportResultsListToPDF(results, 'Liste des résultats GeoSearch');
          break;
      }

      toast({
        title: "Export réussi",
        description: "Le fichier PDF a été téléchargé avec succès.",
        variant: "default"
      });

    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de la génération du PDF.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isPDFExportSupported()) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`${className} ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Export...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => handleExport('complete')}
          disabled={isExporting || results.length === 0}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span>Rapport complet</span>
            <span className="text-xs text-muted-foreground">
              Carte + résultats ({results.length} items)
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => handleExport('map')}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <Map className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span>Carte uniquement</span>
            <span className="text-xs text-muted-foreground">
              Vue cartographique actuelle
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleExport('results')}
          disabled={isExporting || results.length === 0}
          className="cursor-pointer"
        >
          <List className="h-4 w-4 mr-2" />
          <div className="flex flex-col">
            <span>Liste des résultats</span>
            <span className="text-xs text-muted-foreground">
              Tableau détaillé ({results.length} items)
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportPDFButton;