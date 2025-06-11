
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, Loader2 } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';
import { useTranslation } from 'react-i18next';

interface PrintButtonProps {
  results: SearchResult[];
  userLocation?: [number, number];
  filters?: any;
  className?: string;
}

const PrintButton: React.FC<PrintButtonProps> = ({
  results,
  userLocation,
  filters,
  className = ""
}) => {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePrintableContent = () => {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const searchSummary = filters?.query || filters?.category || 'Recherche géographique';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Résultats de recherche - LocaSimple</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #4b5563; margin-top: 30px; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
            .summary { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .result-item { 
              border: 1px solid #e5e7eb; 
              border-radius: 8px; 
              padding: 15px; 
              margin-bottom: 15px; 
              page-break-inside: avoid;
            }
            .result-name { font-weight: bold; font-size: 18px; color: #1f2937; }
            .result-address { color: #6b7280; margin: 5px 0; }
            .result-details { display: flex; gap: 15px; margin-top: 10px; }
            .result-distance { background: #dbeafe; padding: 5px 10px; border-radius: 4px; }
            .result-category { background: #f3e8ff; padding: 5px 10px; border-radius: 4px; }
            .coordinates { font-family: monospace; font-size: 12px; color: #9ca3af; }
            .footer { margin-top: 40px; text-align: center; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🗺️ LocaSimple - Résultats de recherche</h1>
            <div>${currentDate}</div>
          </div>
          
          <div class="summary">
            <h2>📋 Résumé de la recherche</h2>
            <p><strong>Recherche :</strong> ${searchSummary}</p>
            <p><strong>Nombre de résultats :</strong> ${results.length}</p>
            ${userLocation ? `<p><strong>Position :</strong> ${userLocation[1].toFixed(4)}, ${userLocation[0].toFixed(4)}</p>` : ''}
            ${filters?.transport ? `<p><strong>Transport :</strong> ${filters.transport}</p>` : ''}
            ${filters?.distance ? `<p><strong>Rayon :</strong> ${filters.distance} km</p>` : ''}
          </div>

          <h2>📍 Lieux trouvés</h2>
          ${results.map((result, index) => `
            <div class="result-item">
              <div class="result-name">${index + 1}. ${result.name}</div>
              <div class="result-address">📍 ${result.address}</div>
              <div class="result-details">
                <span class="result-distance">📏 ${result.distance} km</span>
                <span class="result-category">🏷️ ${result.category}</span>
                ${result.duration ? `<span>⏱️ ${result.duration} min</span>` : ''}
              </div>
              <div class="coordinates">Coordonnées: ${result.coordinates[1].toFixed(6)}, ${result.coordinates[0].toFixed(6)}</div>
            </div>
          `).join('')}

          <div class="footer">
            <p>Document généré par LocaSimple le ${currentDate}</p>
            <p>🌐 Application de recherche géographique - https://locasimple.com</p>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    setIsGenerating(true);
    
    try {
      const content = generatePrintableContent();
      
      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Popup bloqué');
      }

      printWindow.document.write(content);
      printWindow.document.close();
      
      // Attendre que le contenu soit chargé puis imprimer
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
          }, 500);
        }, 500);
      };

      console.log('🖨️ Impression lancée avec', results.length, 'résultats');
    } catch (error) {
      console.error('❌ Erreur lors de l\'impression:', error);
      alert('Erreur lors de la génération du document d\'impression');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    
    try {
      // Fallback: télécharger en HTML si pas de PDF
      const content = generatePrintableContent();
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `locasimple-resultats-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      console.log('💾 Document HTML téléchargé');
    } catch (error) {
      console.error('❌ Erreur lors du téléchargement:', error);
      alert('Erreur lors du téléchargement');
    } finally {
      setIsGenerating(false);
    }
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        disabled={isGenerating}
        className="flex items-center gap-1"
        title="Imprimer les résultats"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Printer className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {isGenerating ? 'Génération...' : 'Imprimer'}
        </span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="flex items-center gap-1"
        title="Télécharger en HTML"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export</span>
      </Button>
    </div>
  );
};

export default PrintButton;
