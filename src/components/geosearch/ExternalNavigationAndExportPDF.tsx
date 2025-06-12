
import React from 'react';
import { useGeoSearchManager } from '@/hooks/geosearch/useGeoSearchManager';
import { Button } from '@/components/ui/button';

const ExternalNavigationAndExportPDF = () => {
  const { filters, userLocation, results } = useGeoSearchManager();
  const selectedResult = results[0]; // Premier résultat sélectionné

  const openNavigationApp = () => {
    if (!selectedResult || !userLocation) return;
    
    const [fromLng, fromLat] = userLocation;
    const [toLng, toLat] = selectedResult.coordinates;

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=driving`;
    const wazeUrl = `https://waze.com/ul?ll=${toLat},${toLng}&navigate=yes&from=${fromLat},${fromLng}`;

    // Ouvrir Google Maps par défaut, ou Waze selon préférence
    window.open(gmapsUrl, '_blank');
  };

  const downloadPDF = async () => {
    try {
      // Dynamically import jsPDF and html2canvas
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      const element = document.getElementById('geo-map-container');
      if (!element) {
        console.warn('Élément carte non trouvé pour l\'export PDF');
        return;
      }

      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        scale: 1
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ 
        orientation: 'landscape', 
        unit: 'px', 
        format: [canvas.width, canvas.height] 
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('carte-geographique.pdf');
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    }
  };

  if (!selectedResult || !userLocation) {
    return null;
  }

  return (
    <div className="flex gap-4 mt-4 justify-end flex-wrap">
      <Button onClick={openNavigationApp} variant="default" size="sm">
        📍 Itinéraire Google Maps
      </Button>
      <Button onClick={downloadPDF} variant="secondary" size="sm">
        🖨️ Exporter en PDF
      </Button>
    </div>
  );
};

export default ExternalNavigationAndExportPDF;
