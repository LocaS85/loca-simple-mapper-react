import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Heart, 
  Star, 
  Trash2, 
  Search, 
  MapPin, 
  Clock, 
  Route,
  Edit,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { GeoSearchFilters, SearchResult } from '@/types/unified';
import { TransportMode } from '@/types/map';

interface FavoriteSearch {
  id: string;
  name: string;
  description?: string;
  filters: GeoSearchFilters;
  results: SearchResult[];
  userLocation: [number, number] | null;
  createdAt: number;
  lastUsed: number;
  useCount: number;
  tags: string[];
}

interface FavoritesManagerProps {
  currentFilters?: GeoSearchFilters;
  currentResults?: SearchResult[];
  currentLocation?: [number, number] | null;
  onLoadFavorite?: (favorite: FavoriteSearch) => void;
}

const STORAGE_KEY = 'geosearch_favorites';
const MAX_FAVORITES = 20;

const FavoritesManager: React.FC<FavoritesManagerProps> = ({
  currentFilters,
  currentResults = [],
  currentLocation,
  onLoadFavorite
}) => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteSearch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFavorite, setEditingFavorite] = useState<FavoriteSearch | null>(null);
  const [newFavoriteName, setNewFavoriteName] = useState('');
  const [newFavoriteDescription, setNewFavoriteDescription] = useState('');

  // Charger les favoris au montage
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FavoriteSearch[];
        setFavorites(parsed.sort((a, b) => b.lastUsed - a.lastUsed));
      }
    } catch (error) {
      console.warn('Erreur lors du chargement des favoris:', error);
      setFavorites([]);
    }
  };

  const saveFavorites = (updatedFavorites: FavoriteSearch[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des favoris:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les favoris",
        variant: "destructive"
      });
    }
  };

  const addToFavorites = () => {
    if (!currentFilters || !newFavoriteName.trim()) {
      toast({
        title: "Erreur",
        description: "Nom requis pour sauvegarder un favori",
        variant: "destructive"
      });
      return;
    }

    if (favorites.length >= MAX_FAVORITES) {
      toast({
        title: "Limite atteinte",
        description: `Vous ne pouvez avoir que ${MAX_FAVORITES} favoris maximum`,
        variant: "destructive"
      });
      return;
    }

    const newFavorite: FavoriteSearch = {
      id: `fav_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      name: newFavoriteName.trim(),
      description: newFavoriteDescription.trim() || undefined,
      filters: currentFilters,
      results: currentResults,
      userLocation: currentLocation,
      createdAt: Date.now(),
      lastUsed: Date.now(),
      useCount: 0,
      tags: extractTags(currentFilters)
    };

    const updatedFavorites = [newFavorite, ...favorites];
    saveFavorites(updatedFavorites);
    
    setNewFavoriteName('');
    setNewFavoriteDescription('');
    
    toast({
      title: "Favori ajouté",
      description: `"${newFavorite.name}" a été sauvegardé`
    });
  };

  const removeFavorite = (id: string) => {
    const favorite = favorites.find(f => f.id === id);
    const updatedFavorites = favorites.filter(f => f.id !== id);
    saveFavorites(updatedFavorites);
    
    toast({
      title: "Favori supprimé",
      description: favorite ? `"${favorite.name}" a été supprimé` : "Favori supprimé"
    });
  };

  const loadFavorite = (favorite: FavoriteSearch) => {
    // Mettre à jour les statistiques d'utilisation
    const updatedFavorite = {
      ...favorite,
      lastUsed: Date.now(),
      useCount: favorite.useCount + 1
    };
    
    const updatedFavorites = favorites.map(f => 
      f.id === favorite.id ? updatedFavorite : f
    ).sort((a, b) => b.lastUsed - a.lastUsed);
    
    saveFavorites(updatedFavorites);
    
    // Charger le favori
    onLoadFavorite?.(updatedFavorite);
    setIsOpen(false);
    
    toast({
      title: "Favori chargé",
      description: `Recherche "${favorite.name}" restaurée`
    });
  };

  const updateFavorite = (updatedFavorite: FavoriteSearch) => {
    const updatedFavorites = favorites.map(f => 
      f.id === updatedFavorite.id ? updatedFavorite : f
    );
    saveFavorites(updatedFavorites);
    setEditingFavorite(null);
    
    toast({
      title: "Favori modifié",
      description: `"${updatedFavorite.name}" a été mis à jour`
    });
  };

  const extractTags = (filters: GeoSearchFilters): string[] => {
    const tags: string[] = [];
    
    if (filters.category) {
      const category = Array.isArray(filters.category) ? filters.category[0] : filters.category;
      tags.push(category);
    }
    
    if (filters.transport) {
      tags.push(filters.transport);
    }
    
    if (filters.showMultiDirections) {
      tags.push('multi-routes');
    }
    
    return tags;
  };

  const getTransportIcon = (mode: TransportMode) => {
    const icons = {
      walking: '🚶',
      cycling: '🚴',
      car: '🚗',
      driving: '🚗',
      bus: '🚌',
      train: '🚊',
      transit: '🚌'
    };
    return icons[mode] || '📍';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const filteredFavorites = favorites.filter(favorite =>
    favorite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    favorite.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    favorite.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Favoris
          {favorites.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {favorites.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Favoris ({favorites.length}/{MAX_FAVORITES})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ajouter un nouveau favori */}
          {currentFilters && (
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Sauvegarder la recherche actuelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Nom du favori..."
                  value={newFavoriteName}
                  onChange={(e) => setNewFavoriteName(e.target.value)}
                />
                <Input
                  placeholder="Description (optionnel)..."
                  value={newFavoriteDescription}
                  onChange={(e) => setNewFavoriteDescription(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={addToFavorites}
                    disabled={!newFavoriteName.trim() || favorites.length >= MAX_FAVORITES}
                    className="flex-1"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Ajouter aux favoris
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recherche dans les favoris */}
          {favorites.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les favoris..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {/* Liste des favoris */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredFavorites.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {favorites.length === 0 ? (
                    <div>
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun favori sauvegardé</p>
                      <p className="text-sm">Effectuez une recherche puis sauvegardez-la ici</p>
                    </div>
                  ) : (
                    <p>Aucun favori ne correspond à votre recherche</p>
                  )}
                </div>
              ) : (
                filteredFavorites.map((favorite, index) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 mr-4">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium truncate">{favorite.name}</h4>
                              {favorite.useCount > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {favorite.useCount}× utilisé
                                </Badge>
                              )}
                            </div>
                            
                            {favorite.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {favorite.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(favorite.lastUsed)}
                              </span>
                              
                              {favorite.filters.transport && (
                                <span className="flex items-center gap-1">
                                  {getTransportIcon(favorite.filters.transport)}
                                  {favorite.filters.transport}
                                </span>
                              )}
                              
                              {favorite.results.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {favorite.results.length} résultats
                                </span>
                              )}
                              
                              {favorite.filters.showMultiDirections && (
                                <span className="flex items-center gap-1">
                                  <Route className="h-3 w-3" />
                                  Multi-routes
                                </span>
                              )}
                            </div>
                            
                            {favorite.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {favorite.tags.map((tag, tagIndex) => (
                                  <Badge key={tagIndex} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              onClick={() => loadFavorite(favorite)}
                              className="w-full"
                            >
                              Charger
                            </Button>
                            
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingFavorite(favorite)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFavorite(favorite.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FavoritesManager;