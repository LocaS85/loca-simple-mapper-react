
import React, { forwardRef } from 'react';
import { SearchResult } from '@/types/geosearch';
import { formatDistance, formatDuration } from '@/utils/formatting';

interface PrintViewProps {
  results: SearchResult[];
  filters: any;
  userLocation?: [number, number];
  mapImageUrl?: string;
}

const PrintView = forwardRef<HTMLDivElement, PrintViewProps>(({
  results,
  filters,
  userLocation,
  mapImageUrl
}, ref) => {
  return (
    <div ref={ref} className="p-6 bg-white max-w-4xl mx-auto print:shadow-none">
      {/* En-tête */}
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Résultats de recherche</h1>
        <p className="text-gray-600 mt-2">
          Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
        </p>
      </div>

      {/* Filtres appliqués */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="font-semibold text-gray-800 mb-2">Critères de recherche</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {filters.query && (
            <div>
              <span className="font-medium">Recherche :</span> {filters.query}
            </div>
          )}
          {filters.category && (
            <div>
              <span className="font-medium">Catégorie :</span> {filters.category}
            </div>
          )}
          {filters.transport && (
            <div>
              <span className="font-medium">Transport :</span> {filters.transport}
            </div>
          )}
          {filters.distance && (
            <div>
              <span className="font-medium">Distance max :</span> {filters.distance} km
            </div>
          )}
        </div>
      </div>

      {/* Carte statique */}
      {mapImageUrl && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">Carte</h2>
          <img 
            src={mapImageUrl} 
            alt="Carte des résultats"
            className="w-full max-w-2xl mx-auto border rounded-lg"
          />
        </div>
      )}

      {/* Liste des résultats */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-4">
          Résultats ({results.length} lieu{results.length > 1 ? 'x' : ''})
        </h2>
        
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={result.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-800">
                  {index + 1}. {result.name}
                </h3>
                <div className="flex gap-4 text-sm text-gray-600">
                  {result.distance && (
                    <span>📍 {formatDistance(result.distance)}</span>
                  )}
                  {result.duration && (
                    <span>⏱️ {formatDuration(result.duration)}</span>
                  )}
                </div>
              </div>
              
              {result.address && (
                <p className="text-gray-600 mb-2">{result.address}</p>
              )}
              
              {result.category && (
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {result.category}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pied de page */}
      <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
        Document généré par GeoSearch
      </div>
    </div>
  );
});

PrintView.displayName = 'PrintView';

export default PrintView;
