import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Route,
  Star,
  Phone,
  Globe,
  Navigation
} from 'lucide-react';
import { SearchResult } from '@/types/geosearch';
import { formatDistance } from '@/utils/formatting';
import ExportPDFButton from '../ExportPDFButton';
import NavigationButtons from '../NavigationButtons';

interface GoogleMapsResultsListProps {
  results: SearchResult[];
  isLoading: boolean;
  onResultClick: (result: SearchResult) => void;
  onToggle: () => void;
  isOpen: boolean;
  mobile?: boolean;
}

const GoogleMapsResultsList: React.FC<GoogleMapsResultsListProps> = ({
  results,
  isLoading,
  onResultClick,
  onToggle,
  isOpen,
  mobile = false
}) => {
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');

  const handleResultClick = (result: SearchResult) => {
    setSelectedResultId(result.id);
    onResultClick(result);
  };

  const toggleDistanceUnit = () => {
    setDistanceUnit(distanceUnit === 'km' ? 'miles' : 'km');
  };

  if (!isOpen && !mobile) return null;

  return (
    <div className={`
      bg-white border-l border-gray-200 shadow-lg
      ${mobile ? 'w-full' : 'w-80'}
      ${isOpen ? 'block' : 'hidden'}
      transition-all duration-300
    `}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Résultats ({results.length})
            </h3>
            
            {!mobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDistanceUnit}
              className="text-xs"
            >
              {distanceUnit === 'km' ? 'km' : 'mi'}
            </Button>

            <ExportPDFButton
              results={results}
              variant="outline"
              size="sm"
              includeMap={true}
              mapElementId="geo-map-container"
            />
          </div>
        </div>

        {/* Liste des résultats */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Recherche en cours...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center">
              <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun résultat trouvé</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {results.map((result, index) => {
                const isSelected = selectedResultId === result.id;
                
                return (
                  <div
                    key={result.id}
                    className={`
                      p-4 cursor-pointer transition-colors
                      ${isSelected 
                        ? 'bg-blue-50 border-l-4 border-blue-500' 
                        : 'hover:bg-gray-50'
                      }
                    `}
                    onClick={() => handleResultClick(result)}
                  >
                    {/* Header du résultat */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 line-clamp-1">
                          {result.name}
                        </h4>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {result.address}
                        </p>
                      </div>
                      
                      <Badge variant="outline" className="ml-2 text-xs">
                        #{index + 1}
                      </Badge>
                    </div>

                    {/* Métriques */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {result.distance && (
                        <div className="flex items-center gap-1">
                          <Route className="h-3 w-3" />
                          <span>{result.distance.toFixed(1)} {distanceUnit}</span>
                        </div>
                      )}
                      
                      {result.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{result.duration} min</span>
                        </div>
                      )}
                      
                      {result.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{result.rating}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {isSelected && (
                      <div className="space-y-2">
                        {/* Navigation externe */}
                        <NavigationButtons
                          destination={{
                            lat: result.coordinates[1],
                            lng: result.coordinates[0],
                            name: result.name
                          }}
                          className="flex gap-1"
                        />

                        {/* Informations supplémentaires */}
                        {(result.phone || result.website) && (
                          <div className="flex gap-2 pt-2 border-t border-gray-200">
                            {result.phone && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="flex-1"
                              >
                                <a href={`tel:${result.phone}`}>
                                  <Phone className="h-3 w-3 mr-1" />
                                  Appeler
                                </a>
                              </Button>
                            )}
                            
                            {result.website && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="flex-1"
                              >
                                <a href={result.website} target="_blank" rel="noopener noreferrer">
                                  <Globe className="h-3 w-3 mr-1" />
                                  Site web
                                </a>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default GoogleMapsResultsList;