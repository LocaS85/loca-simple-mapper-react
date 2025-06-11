
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';
import PrintView from './PrintView';
import { useGeoSearchStore } from '@/store/geoSearchStore';

interface PrintButtonProps {
  results: SearchResult[];
  className?: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({ results, className = "" }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { filters, userLocation } = useGeoSearchStore();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Résultats de recherche GeoSearch',
    onBeforeGetContent: () => {
      // Optionnel: préparer le contenu avant impression
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log('📄 Impression terminée');
    }
  });

  if (results.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handlePrint}
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 ${className}`}
        title="Imprimer les résultats"
      >
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">Imprimer</span>
      </Button>

      {/* Composant d'impression masqué */}
      <div className="hidden">
        <PrintView
          ref={printRef}
          results={results}
          filters={filters}
          userLocation={userLocation}
        />
      </div>
    </>
  );
};

export default PrintButton;
