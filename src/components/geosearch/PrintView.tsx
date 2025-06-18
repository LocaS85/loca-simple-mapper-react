
import React from 'react';
import { SearchResult } from '@/types/geosearch';

interface PrintViewProps {
  results: SearchResult[];
  filters: Record<string, string | number | boolean>;
}

const PrintView: React.FC<PrintViewProps> = ({ results, filters }) => {
  return (
    <div className="print-only p-6 bg-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Résultats de recherche GeoSearch</h1>
        <div className="text-sm text-gray-600">
          <p>Date d'impression: {new Date().toLocaleDateString('fr-FR')}</p>
          <p>Nombre de résultats: {results.length}</p>
          {filters.query && <p>Recherche: {filters.query}</p>}
          {filters.category && <p>Catégorie: {filters.category}</p>}
        </div>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={result.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{result.name}</h3>
                <p className="text-gray-600">{result.address}</p>
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span>Catégorie: {result.category}</span>
                  {result.distance && <span>Distance: {result.distance} km</span>}
                  {result.duration && <span>Durée: {result.duration} min</span>}
                </div>
              </div>
              <span className="text-sm text-gray-400">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-xs text-gray-400 text-center">
        Généré par GeoSearch - Application de recherche géographique
      </div>
    </div>
  );
};

export default PrintView;
