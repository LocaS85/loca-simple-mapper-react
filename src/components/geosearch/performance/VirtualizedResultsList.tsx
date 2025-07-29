import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FixedSizeList as List } from 'react-window';
import { SearchResult } from '@/types/geosearch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VirtualizedResultsListProps {
  results: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
  height?: number;
  className?: string;
}

// Composant mémoïsé pour chaque résultat
const ResultItem = memo<{
  index: number;
  style: React.CSSProperties;
  data: {
    results: SearchResult[];
    onResultClick?: (result: SearchResult) => void;
  };
}>(({ index, style, data }) => {
  const result = data.results[index];
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, delay: index * 0.05 }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

  const handleClick = () => {
    data.onResultClick?.(result);
  };

  const formatDistance = useMemo(() => {
    if (!result.distance) return null;
    const distance = typeof result.distance === 'string' ? parseFloat(result.distance) : result.distance;
    return distance < 1000 
      ? `${Math.round(distance)}m`
      : `${(distance / 1000).toFixed(1)}km`;
  }, [result.distance]);

  const formatDuration = useMemo(() => {
    if (!result.duration) return null;
    const duration = typeof result.duration === 'string' ? parseFloat(result.duration) : result.duration;
    return duration < 60
      ? `${Math.round(duration)}min`
      : `${Math.floor(duration / 60)}h${Math.round(duration % 60)}min`;
  }, [result.duration]);

  return (
    <div style={style} className="px-2 py-1">
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="h-full"
      >
        <Card 
          className="h-full cursor-pointer border-border/50 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
          onClick={handleClick}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Icône de catégorie */}
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>

              {/* Contenu principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-foreground truncate">
                    {result.name}
                  </h3>
                  
                  {result.rating && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{result.rating}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {result.address}
                </p>

                {/* Badges d'informations */}
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {formatDistance && (
                    <Badge variant="secondary" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {formatDistance}
                    </Badge>
                  )}
                  
                  {formatDuration && (
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDuration}
                    </Badge>
                  )}

                  {result.category && (
                    <Badge variant="outline" className="text-xs">
                      {result.category}
                    </Badge>
                  )}
                </div>

                {/* Statut d'ouverture */}
                {result.openingHours && (
                  <div className="mt-2">
                    <Badge 
                      variant={result.openingHours.includes('Ouvert') ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {result.openingHours.includes('Ouvert') ? 'Ouvert' : 'Fermé'}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Bouton d'action */}
              <Button
                variant="ghost"
                size="sm"
                className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
});

ResultItem.displayName = 'ResultItem';

const VirtualizedResultsList: React.FC<VirtualizedResultsListProps> = ({
  results,
  onResultClick,
  height = 400,
  className = ''
}) => {
  const itemData = useMemo(() => ({
    results,
    onResultClick
  }), [results, onResultClick]);

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div className="space-y-2">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Aucun résultat trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <List
        height={height}
        width="100%"
        itemCount={results.length}
        itemSize={120} // Hauteur fixe par item
        itemData={itemData}
        className="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      >
        {ResultItem}
      </List>
    </div>
  );
};

export default memo(VirtualizedResultsList);