
import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { SearchResult } from '@/types/geosearch';

interface PrintButtonProps {
  results: SearchResult[];
}

const PrintButton: React.FC<PrintButtonProps> = ({ results }) => {
  const handlePrint = () => {
    // Simple print functionality
    const printContent = `
      <h1>Résultats de recherche</h1>
      <p>Trouvé ${results.length} résultat(s)</p>
      <ul>
        ${results.map(result => `
          <li>
            <strong>${result.name}</strong><br>
            ${result.address || 'Adresse non disponible'}<br>
            Distance: ${result.distance || 'N/A'} km
          </li>
        `).join('')}
      </ul>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Résultats de recherche</title></head>
          <body>${printContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className="bg-white shadow-md hover:bg-gray-50"
      disabled={results.length === 0}
    >
      <Printer className="h-4 w-4" />
    </Button>
  );
};

export default PrintButton;
