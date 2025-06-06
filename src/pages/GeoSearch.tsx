
import React from 'react';
import GeoSearchController from '@/components/geosearch/GeoSearchController';
import GeoSearchLayout from '@/components/geosearch/GeoSearchLayout';
import SEOHead from '@/components/SEOHead';
import { MapboxTokenWarning } from '@/components/MapboxTokenWarning';
import { useTranslation } from 'react-i18next';
import { useGeoSearchManager } from '@/hooks/useGeoSearchManager';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';

const GeoSearch: React.FC = () => {
  const { t } = useTranslation();
  const [showTokenWarning, setShowTokenWarning] = React.useState(false);

  const {
    filters,
    statusInfo
  } = useGeoSearchManager();

  // Check Mapbox token
  React.useEffect(() => {
    if (!isMapboxTokenValid()) {
      setShowTokenWarning(true);
    }
  }, []);

  const seoTitle = filters.category 
    ? `${filters.category} - ${t('geosearch.title')} | LocaSimple`
    : `${t('geosearch.title')} | LocaSimple`;
    
  const seoDescription = filters.category
    ? t('geosearch.seoDescWithCategory', { category: filters.category })
    : t('geosearch.seoDesc');

  // Show token warning if needed
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
        <GeoSearchLayout />
      </GeoSearchController>
    </>
  );
};

export default GeoSearch;
