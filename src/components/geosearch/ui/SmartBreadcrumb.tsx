import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, MapPin } from 'lucide-react';
import { parseGeoSearchParams } from '@/utils/categorySearchParams';

const SmartBreadcrumb: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const params = parseGeoSearchParams(searchParams);
  
  const handleBackToCategories = () => {
    navigate('/categories', { 
      state: { 
        fromGeoSearch: true,
        previousSearch: params
      }
    });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center gap-1 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToHome}
        className="h-7 px-2 text-gray-600 hover:text-gray-900"
      >
        <Home className="h-3 w-3" />
      </Button>
      
      <ChevronLeft className="h-3 w-3 text-gray-400" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToCategories}
        className="h-7 px-2 text-gray-600 hover:text-gray-900"
      >
        Catégories
      </Button>
      
      {params.category && (
        <>
          <ChevronLeft className="h-3 w-3 text-gray-400" />
          <div className="flex items-center gap-1 px-2 h-7 bg-primary/10 rounded text-primary font-medium">
            <MapPin className="h-3 w-3" />
            <span className="truncate max-w-[120px]">{params.category}</span>
          </div>
        </>
      )}
      
      {params.query && params.query !== params.category && (
        <>
          <ChevronLeft className="h-3 w-3 text-gray-400" />
          <div className="px-2 h-7 bg-gray-100 rounded text-gray-700 text-xs">
            <span className="truncate max-w-[100px]">"{params.query}"</span>
          </div>
        </>
      )}
    </div>
  );
};

export default SmartBreadcrumb;