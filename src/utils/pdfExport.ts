import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SearchResult } from '@/types/geosearch';
import { TransportMode } from '@/types/map';

export interface PDFExportOptions {
  title?: string;
  includeMap?: boolean;
  includeResults?: boolean;
  mapElementId?: string;
  paperSize?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
}

export interface PDFExportData {
  results: SearchResult[];
  userLocation?: [number, number];
  transport?: TransportMode;
  filters?: {
    category?: string;
    distance?: number;
    query?: string;
  };
}

/**
 * Exporter les résultats et la carte en PDF
 */
export const exportToPDF = async (
  data: PDFExportData,
  options: PDFExportOptions = {}
): Promise<void> => {
  const {
    title = 'Résultats de recherche géographique',
    includeMap = true,
    includeResults = true,
    mapElementId = 'map-container',
    paperSize = 'a4',
    orientation = 'portrait',
    quality = 0.95
  } = options;

  try {
    // Créer le PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: paperSize
    });

    let yPosition = 20;

    // Ajouter le titre
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text(title, 20, yPosition);
    yPosition += 15;

    // Ajouter les informations de recherche
    if (data.filters) {
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      
      if (data.filters.query) {
        pdf.text(`Recherche: ${data.filters.query}`, 20, yPosition);
        yPosition += 8;
      }
      
      if (data.filters.category) {
        pdf.text(`Catégorie: ${data.filters.category}`, 20, yPosition);
        yPosition += 8;
      }
      
      if (data.filters.distance) {
        pdf.text(`Rayon: ${data.filters.distance} km`, 20, yPosition);
        yPosition += 8;
      }
      
      if (data.transport) {
        const transportLabels = {
          walking: 'À pied',
          cycling: 'À vélo',
          driving: 'En voiture',
          transit: 'Transport en commun'
        };
        pdf.text(`Transport: ${transportLabels[data.transport] || data.transport}`, 20, yPosition);
        yPosition += 8;
      }
    }

    pdf.text(`Trouvé: ${data.results.length} résultat(s)`, 20, yPosition);
    yPosition += 15;

    // Ajouter la carte si demandée
    if (includeMap && mapElementId) {
      try {
        const mapElement = document.getElementById(mapElementId);
        if (mapElement) {
          console.log('📸 Capture de la carte...');
          
          const canvas = await html2canvas(mapElement, {
            allowTaint: true,
            useCORS: true,
            scale: quality,
            logging: false,
            width: mapElement.offsetWidth,
            height: mapElement.offsetHeight
          });

          const imgData = canvas.toDataURL('image/jpeg', quality);
          
          // Calculer les dimensions pour adapter à la page
          const pageWidth = pdf.internal.pageSize.getWidth() - 40; // marges
          const pageHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = pageWidth;
          const imgHeight = (canvas.height * pageWidth) / canvas.width;
          
          // Vérifier si l'image rentre sur la page
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          pdf.addImage(imgData, 'JPEG', 20, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + 15;
          
          console.log('✅ Carte ajoutée au PDF');
        }
      } catch (error) {
        console.warn('⚠️ Erreur capture carte:', error);
        // Continuer sans la carte
      }
    }

    // Ajouter les résultats si demandés
    if (includeResults && data.results.length > 0) {
      // Vérifier si on a besoin d'une nouvelle page
      if (yPosition > pdf.internal.pageSize.getHeight() - 80) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.text('Liste des résultats:', 20, yPosition);
      yPosition += 15;

      // Ajouter chaque résultat
      data.results.forEach((result, index) => {
        // Vérifier si on a besoin d'une nouvelle page
        if (yPosition > pdf.internal.pageSize.getHeight() - 30) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text(`${index + 1}. ${result.name}`, 20, yPosition);
        yPosition += 8;

        pdf.setFont(undefined, 'normal');
        if (result.address) {
          pdf.text(`   📍 ${result.address}`, 20, yPosition);
          yPosition += 6;
        }

        if (result.distance) {
          pdf.text(`   📏 Distance: ${result.distance.toFixed(2)} km`, 20, yPosition);
          yPosition += 6;
        }

        if (result.duration) {
          const duration = typeof result.duration === 'number' ? result.duration : parseFloat(result.duration.toString()) || 0;
          pdf.text(`   ⏱️ Durée: ${Math.round(duration)} min`, 20, yPosition);
          yPosition += 6;
        }

        if (result.rating) {
          pdf.text(`   ⭐ Note: ${result.rating}/5`, 20, yPosition);
          yPosition += 6;
        }

        if (result.phone) {
          pdf.text(`   📞 ${result.phone}`, 20, yPosition);
          yPosition += 6;
        }

        if (result.website) {
          pdf.text(`   🌐 ${result.website}`, 20, yPosition);
          yPosition += 6;
        }

        yPosition += 5; // Espacement entre résultats
      });
    }

    // Ajouter pied de page
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'normal');
      pdf.text(
        `Généré le ${new Date().toLocaleDateString()} - Page ${i}/${pageCount}`,
        20,
        pdf.internal.pageSize.getHeight() - 10
      );
    }

    // Télécharger le PDF
    const filename = `geosearch-results-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    console.log('✅ PDF généré et téléchargé:', filename);
  } catch (error) {
    console.error('❌ Erreur génération PDF:', error);
    throw new Error('Impossible de générer le PDF');
  }
};

/**
 * Créer un PDF simple avec uniquement la liste des résultats
 */
export const exportResultsListToPDF = async (
  results: SearchResult[],
  title = 'Liste des résultats'
): Promise<void> => {
  return exportToPDF(
    { results },
    {
      title,
      includeMap: false,
      includeResults: true
    }
  );
};

/**
 * Vérifier si l'export PDF est supporté
 */
export const isPDFExportSupported = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof document !== 'undefined' &&
         'HTMLCanvasElement' in window;
};

/**
 * Estimer la taille du PDF en fonction des données
 */
export const estimatePDFSize = (data: PDFExportData, options: PDFExportOptions = {}): number => {
  let size = 50; // Taille de base en KB

  if (options.includeMap) {
    size += 500; // Estimation pour une capture de carte
  }

  if (options.includeResults) {
    size += data.results.length * 2; // ~2KB par résultat
  }

  return size;
};