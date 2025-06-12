
import React from 'react';

interface GeocoderContainerProps {
  className?: string;
}

const GeocoderContainer: React.FC<GeocoderContainerProps> = ({ 
  className = "w-full my-4" 
}) => {
  return (
    <div 
      id="geocoder-container" 
      className={`geocoder-container ${className}`}
      style={{
        minHeight: '44px'
      }}
    />
  );
};

export default GeocoderContainer;
