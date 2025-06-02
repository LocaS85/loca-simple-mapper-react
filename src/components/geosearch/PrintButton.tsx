
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';

interface PrintButtonProps {
  results: SearchResult[];
}

const PrintButton: React.FC<PrintButtonProps> = ({ results }) => {
  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert('Veuillez autoriser les popups pour cette fonctionnalité');
      return;
    }
    
    // Generate print content
    const content = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Résultats de recherche</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1 {
            color: #3b82f6;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 10px;
          }
          .result {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .result-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .result-address {
            color: #6b7280;
            margin-bottom: 10px;
          }
          .result-details {
            display: flex;
            justify-content: space-between;
          }
          .result-detail {
            font-size: 14px;
            color: #4b5563;
          }
          .print-date {
            text-align: right;
            font-size: 12px;
            color: #9ca3af;
            margin-top: 40px;
          }
          .no-results {
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <h1>Résultats de recherche</h1>
        ${results.length > 0 
          ? results.map(result => `
            <div class="result">
              <div class="result-name">${result.name}</div>
              <div class="result-address">${result.address}</div>
              <div class="result-details">
                <span class="result-detail">Distance: ${result.distance} km</span>
                <span class="result-detail">Durée estimée: ${result.duration} min</span>
              </div>
            </div>
          `).join('')
          : '<div class="no-results">Aucun résultat trouvé</div>'
        }
        <div class="print-date">Imprimé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</div>
      </body>
      </html>
    `;
    
    // Write content to the new window
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Print after content is loaded
    printWindow.addEventListener('load', () => {
      printWindow.print();
    });
  };
  
  return (
    <div className="fixed bottom-20 right-4 z-10">
      <Button
        variant="secondary"
        size="icon"
        className="bg-white shadow-md hover:bg-gray-100"
        onClick={handlePrint}
        title="Imprimer les résultats"
      >
        <Printer className="h-5 w-5 text-gray-700" />
      </Button>
    </div>
  );
};

export default PrintButton;
