
import React from 'react';
import MapView from '@/components/geosearch/MapView';
import FloatingControls from '@/components/geosearch/FloatingControls';
import PrintButton from '@/components/geosearch/PrintButton';
import MultiMapToggle from '@/components/geosearch/MultiMapToggle';
import GeoSearchController from '@/components/geosearch/GeoSearchController';
import SEOHead from '@/components/SEOHead';
import { MapboxTokenWarning } from '@/components/MapboxTokenWarning';
import { useTranslation } from 'react-i18next';
import { useGeoSearchCoordination } from '@/hooks/useGeoSearchCoordination';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';

const GeoSearch: React.FC = () => {
  const { t } = useTranslation();
  const [showTokenWarning, setShowTokenWarning] = React.useState(false);

  const {
    filters,
    results,
    isLoading,
    handleLocationSelect,
    handleSearch,
    handleMyLocationClick,
    updateCoordinatedFilters
  } = useGeoSearchCoordination();

  // Vérifier le token Mapbox
  React.useEffect(() => {
    if (!isMapboxTokenValid()) {
      setShowTokenWarning(true);
    }
  }, []);

  const handleResetFilters = () => {
    updateCoordinatedFilters({
      category: null,
      subcategory: null,
      transport: 'walking',
      distance: 10,
      unit: 'km',
      query: '',
      aroundMeCount: 3,
      showMultiDirections: false,
      maxDuration: 20
    });
  };

  const seoTitle = filters.category 
    ? `${filters.category} - ${t('geosearch.title')} | LocaSimple`
    : `${t('geosearch.title')} | LocaSimple`;
    
  const seoDescription = filters.category
    ? t('geosearch.seoDescWithCategory', { category: filters.category })
    : t('geosearch.seoDesc');

  // Afficher l'avertissement du token
  if (showTokenWarning) {
    return (
      <>
        <SEOHead title={seoTitle} description={seoDescription} />
        <MapboxTokenWarning onTokenUpdate={() => setShowTokenWarning(false)} />
      </>
    );
  }

  return (
    <>
      <SEOHead title={seoTitle} description={seoDescription} />
      
      <GeoSearchController>
        <div className="relative h-screen w-full overflow-hidden">
          {/* Carte avec système coordonné */}
          <MapView transport={filters.transport} />
          
          {/* Contrôles flottants coordonnés */}
          <FloatingControls
            filters={filters}
            onLocationSelect={handleLocationSelect}
            onSearch={handleSearch}
            onMyLocationClick={handleMyLocationClick}
            onFiltersChange={updateCoordinatedFilters}
            onResetFilters={handleResetFilters}
            isLoading={isLoading}
          />
          
          {/* Boutons d'action coordonnés */}
          <div className="fixed bottom-4 right-4 z-10 flex flex-col gap-2">
            <MultiMapToggle />
            <PrintButton results={results} />
          </div>
        </div>
      </GeoSearchController>
    </>
  );
};

export default GeoSearch;
