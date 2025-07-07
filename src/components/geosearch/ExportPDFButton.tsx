import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, AlertCircle } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';
import { TransportMode } from '@/types/map';
import { exportToPDF, isPDFExportSupported, estimatePDFSize } from '@/utils/pdfExport';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface ExportPDFButtonProps {
  results: SearchResult[];
  userLocation?: [number, number];
  transport?: TransportMode;
  filters?: {
    category?: string;
    distance?: number;
    query?: string;
  };
  includeMap?: boolean;
  mapElementId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
  results,
  userLocation,
  transport,
  filters,
  includeMap = true,
  mapElementId = 'map-container',
  variant = 'outline',
  size = 'sm',
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const isSupported = isPDFExportSupported();
  const estimatedSize = estimatePDFSize({ results, userLocation, transport, filters }, { includeMap });

  const handleExport = async () => {
    if (!isSupported) {
      toast({
        title: "Export non supporté",
        description: "L'export PDF n'est pas supporté dans votre navigateur",
        variant: "destructive"
      });
      return;
    }

    if (results.length === 0) {
      toast({
        title: "Aucun résultat",
        description: "Aucun résultat à exporter. Effectuez d'abord une recherche.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      console.log('🔄 Début export PDF...');
      
      await exportToPDF(
        {
          results,
          userLocation,
          transport,
          filters
        },
        {
          title: 'Résultats de recherche géographique',
          includeMap,
          includeResults: true,
          mapElementId,
          paperSize: 'a4',
          orientation: 'portrait',
          quality: 0.8
        }
      );

      toast({
        title: "Export réussi",
        description: `PDF généré avec ${results.length} résultat${results.length > 1 ? 's' : ''}`,
      });

      console.log('✅ Export PDF terminé');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
      
      toast({
        title: "Erreur d'export",
        description: "Impossible de générer le PDF. Réessayez.",
        variant: "destructive"
      });

      console.error('❌ Erreur export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="space-y-2">
        <Button
          variant="outline"
          size={size}
          disabled
          className={`bg-gray-100 text-gray-400 ${className}`}
        >
          <AlertCircle className="h-4 w-4 mr-1" />
          PDF non supporté
        </Button>
        <Alert className="text-xs">
          <AlertCircle className="h-3 w-3" />
          <AlertDescription>
            Export PDF non disponible dans ce navigateur
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        variant={variant}
        size={size}
        onClick={handleExport}
        disabled={isExporting || results.length === 0}
        className={`bg-white shadow-md hover:bg-gray-50 ${className}`}
        title={`Exporter ${results.length} résultat${results.length > 1 ? 's' : ''} en PDF${includeMap ? ' avec carte' : ''}`}
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
            Export...
          </>
        ) : (
          <>
            {includeMap ? (
              <FileText className="h-4 w-4 mr-1" />
            ) : (
              <Download className="h-4 w-4 mr-1" />
            )}
            PDF
          </>
        )}
      </Button>

      {/* Informations sur l'export */}
      {results.length > 0 && !isExporting && (
        <div className="text-xs text-gray-500 space-y-1">
          <div>{results.length} résultat{results.length > 1 ? 's' : ''}</div>
          {includeMap && <div>+ Carte incluse</div>}
          <div>~{estimatedSize} KB</div>
        </div>
      )}

      {/* Affichage d'erreur */}
      {error && (
        <Alert className="text-xs">
          <AlertCircle className="h-3 w-3" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ExportPDFButton;