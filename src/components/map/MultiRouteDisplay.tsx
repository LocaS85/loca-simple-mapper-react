import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGeoSearch } from '@/hooks/geosearch/useGeoSearch';
import { Clock, MapPin, Route } from 'lucide-react';

const MultiRouteDisplay = () => {
  const { results, filters, userLocation } = useGeoSearch();

  useEffect(() => {
    console.log('MultiRouteDisplay - userLocation:', userLocation);
    console.log('MultiRouteDisplay - results:', results);
    console.log('MultiRouteDisplay - filters:', filters);
  }, [results, filters, userLocation]);

  if (!userLocation || results.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Itinéraires multiples
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.slice(0, 3).map((result, index) => (
            <div key={result.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">{result.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {result.duration && (
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {result.duration}min
                  </Badge>
                )}
                {result.distance && (
                  <Badge variant="outline" className="text-xs">
                    {result.distance}km
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiRouteDisplay;
