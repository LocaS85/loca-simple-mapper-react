import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  MapPin, 
  Route, 
  Zap, 
  Leaf, 
  DollarSign,
  TrendingUp,
  Award
} from 'lucide-react';
import { TransportMode } from '@/types/map';
import { motion } from 'framer-motion';

interface RouteData {
  mode: TransportMode;
  duration: number; // en minutes
  distance: number; // en km
  cost?: number; // coût estimé en euros
  emissions?: number; // kg CO2
  calories?: number; // calories brûlées
  reliability?: number; // score de fiabilité sur 100
}

interface RouteComparisonProps {
  routes: RouteData[];
  onRouteSelect?: (route: RouteData) => void;
  selectedRoute?: TransportMode;
  showRecommendations?: boolean;
}

const RouteComparison: React.FC<RouteComparisonProps> = ({
  routes,
  onRouteSelect,
  selectedRoute,
  showRecommendations = true
}) => {
  if (!routes || routes.length === 0) {
    return null;
  }

  // Calculer les recommandations
  const fastest = routes.reduce((min, route) => 
    route.duration < min.duration ? route : min
  );
  
  const shortest = routes.reduce((min, route) => 
    route.distance < min.distance ? route : min
  );
  
  const cheapest = routes.reduce((min, route) => 
    (route.cost || 0) < (min.cost || 0) ? route : min
  );
  
  const greenest = routes.reduce((min, route) => 
    (route.emissions || 0) < (min.emissions || 0) ? route : min
  );

  const getTransportIcon = (mode: TransportMode) => {
    const icons = {
      walking: '🚶',
      cycling: '🚴',
      car: '🚗',
      bus: '🚌',
      train: '🚊'
    };
    return icons[mode] || '📍';
  };

  const getTransportLabel = (mode: TransportMode) => {
    const labels = {
      walking: 'À pied',
      cycling: 'Vélo',
      car: 'Voiture',
      bus: 'Bus',
      train: 'Train'
    };
    return labels[mode] || mode;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  };

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
  };

  const getRecommendationBadge = (route: RouteData) => {
    const badges = [];
    
    if (route.mode === fastest.mode) {
      badges.push({ label: 'Le plus rapide', icon: Zap, color: 'bg-yellow-500' });
    }
    
    if (route.mode === shortest.mode) {
      badges.push({ label: 'Le plus court', icon: TrendingUp, color: 'bg-blue-500' });
    }
    
    if (route.mode === cheapest.mode) {
      badges.push({ label: 'Le moins cher', icon: DollarSign, color: 'bg-green-500' });
    }
    
    if (route.mode === greenest.mode) {
      badges.push({ label: 'Le plus écologique', icon: Leaf, color: 'bg-emerald-500' });
    }
    
    return badges;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
          Comparaison des itinéraires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {routes.map((route, index) => {
            const isSelected = selectedRoute === route.mode;
            const recommendations = getRecommendationBadge(route);
            
            return (
              <motion.div
                key={route.mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-primary ring-2 ring-primary/20 shadow-md' 
                      : 'hover:border-primary/50 hover:shadow-sm'
                  }`}
                  onClick={() => onRouteSelect?.(route)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getTransportIcon(route.mode)}
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            {getTransportLabel(route.mode)}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDuration(route.duration)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {formatDistance(route.distance)}
                            </span>
                            {route.cost !== undefined && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {route.cost.toFixed(2)}€
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {/* Badges de recommandation */}
                        {showRecommendations && recommendations.length > 0 && (
                          <div className="flex flex-wrap gap-1 justify-end">
                            {recommendations.map((rec, idx) => (
                              <Badge 
                                key={idx}
                                variant="secondary" 
                                className={`text-xs text-white ${rec.color}`}
                              >
                                <rec.icon className="h-3 w-3 mr-1" />
                                {rec.label}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Métriques supplémentaires */}
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          {route.emissions !== undefined && (
                            <span className="flex items-center gap-1">
                              <Leaf className="h-3 w-3" />
                              {route.emissions.toFixed(1)}kg CO₂
                            </span>
                          )}
                          {route.calories !== undefined && (
                            <span className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              {route.calories}cal
                            </span>
                          )}
                          {route.reliability !== undefined && (
                            <span className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              {route.reliability}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        {/* Résumé des recommandations */}
        {showRecommendations && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h5 className="font-medium mb-2 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Recommandations
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Plus rapide:</span> {getTransportLabel(fastest.mode)} ({formatDuration(fastest.duration)})
              </div>
              <div>
                <span className="font-medium">Plus court:</span> {getTransportLabel(shortest.mode)} ({formatDistance(shortest.distance)})
              </div>
              <div>
                <span className="font-medium">Moins cher:</span> {getTransportLabel(cheapest.mode)} ({cheapest.cost?.toFixed(2) || 0}€)
              </div>
              <div>
                <span className="font-medium">Plus écologique:</span> {getTransportLabel(greenest.mode)} ({greenest.emissions?.toFixed(1) || 0}kg CO₂)
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteComparison;