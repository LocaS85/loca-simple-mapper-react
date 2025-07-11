
import React from 'react';
import GeoSearchApp from '@/components/geosearch/GeoSearchApp';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Fallback component pour la page GeoSearch
function GeoSearchErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Erreur de recherche géographique</h2>
        <p className="text-gray-600 mb-4">
          {error.message || "Impossible de charger la recherche géographique"}
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={resetErrorBoundary}>
            Réessayer
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

const GeoSearch = () => {
  return (
    <ErrorBoundary 
      FallbackComponent={GeoSearchErrorFallback}
      onError={(error, errorInfo) => {
        console.error('GeoSearch error:', error, errorInfo);
      }}
    >
      <GeoSearchApp />
    </ErrorBoundary>
  );
};

export default GeoSearch;
