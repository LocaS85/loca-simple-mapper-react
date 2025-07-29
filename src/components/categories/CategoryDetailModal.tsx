import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Navigation, Route } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Category, Subcategory } from '@/hooks/useSupabaseCategories';
import { getCategoryIcon, getSubcategoryIcon } from '@/utils/categoryIcons';

interface CategoryDetailModalProps {
  category: Category | null;
  subcategories: Subcategory[];
  isOpen: boolean;
  onClose: () => void;
  transportMode?: string;
  maxDistance?: number;
  distanceUnit?: string;
}

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  category,
  subcategories,
  isOpen,
  onClose,
  transportMode = 'walking',
  maxDistance = 5,
  distanceUnit = 'km'
}) => {
  const navigate = useNavigate();

  if (!category) return null;

  const handleSearchCategory = (multiDirections = false) => {
    const searchParams = new URLSearchParams({
      category: category.id,
      transport: transportMode,
      distance: maxDistance.toString(),
      unit: distanceUnit,
      query: category.name,
      ...(multiDirections && { showMultiDirections: 'true' })
    });
    navigate(`/geosearch?${searchParams.toString()}`);
    onClose();
  };

  const handleSearchSubcategory = (subcategory: Subcategory, multiDirections = false) => {
    const searchParams = new URLSearchParams({
      category: category.id,
      subcategory: subcategory.id,
      transport: transportMode,
      distance: maxDistance.toString(),
      unit: distanceUnit,
      query: subcategory.search_terms?.[0] || subcategory.name,
      ...(multiDirections && { showMultiDirections: 'true' })
    });
    navigate(`/geosearch?${searchParams.toString()}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <motion.div 
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg"
              style={{ 
                backgroundColor: category.color,
                background: `linear-gradient(135deg, ${category.color}, ${category.color}dd)`
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-2xl">
                {getCategoryIcon(category.name, category.icon)}
              </div>
            </motion.div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">{category.name}</DialogTitle>
              <DialogDescription className="text-base">
                {category.description || `Explorez tous les lieux de type ${category.name.toLowerCase()}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleSearchCategory()}
              className="flex items-center gap-2"
              style={{ backgroundColor: category.color }}
            >
              <Search className="h-4 w-4" />
              Rechercher dans {category.name}
            </Button>
            <Button 
              onClick={() => handleSearchCategory(true)}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Route className="h-4 w-4" />
              Tracés multiples
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Autour de moi
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              {maxDistance} {distanceUnit} · {transportMode}
            </Button>
          </div>

          {/* Category Info */}
          <div>
            <h4 className="font-semibold mb-3">Informations</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Type: {category.category_type}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Sous-catégories: {subcategories.length}
              </Badge>
            </div>
          </div>

          {/* Subcategories */}
          {subcategories.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4">Sous-catégories ({subcategories.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subcategories.map((subcategory, index) => (
                  <motion.div
                    key={subcategory.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start p-4 h-auto hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all duration-200 rounded-lg group relative overflow-hidden"
                      onClick={() => handleSearchSubcategory(subcategory)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <div className="flex items-center gap-3 relative z-10">
                        <motion.div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${category.color}15` }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-sm">
                            {getSubcategoryIcon(subcategory.name, category.name, subcategory.icon)}
                          </div>
                        </motion.div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{subcategory.name}</div>
                          {subcategory.description && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {subcategory.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetailModal;