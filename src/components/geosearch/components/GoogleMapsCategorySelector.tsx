import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { unifiedCategories } from '@/data/unifiedCategories';
import CategoryIcon from './CategoryIcon';

interface GoogleMapsCategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

const GoogleMapsCategorySelector: React.FC<GoogleMapsCategorySelectorProps> = ({
  selectedCategories,
  onChange
}) => {
  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId);
    
    if (isSelected) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    onChange(selectedCategories.filter(id => id !== categoryId));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      {/* Catégories sélectionnées */}
      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Sélectionnées</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Tout effacer
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {selectedCategories.map(categoryId => {
              const category = unifiedCategories.find(cat => cat.id === categoryId);
              if (!category) return null;
              
              return (
                <Badge
                  key={categoryId}
                  variant="secondary"
                  className="px-2 py-1 text-xs flex items-center gap-1"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  <CategoryIcon iconName={category.icon} className="w-3 h-3" />
                  {category.name}
                  <button
                    onClick={() => handleRemoveCategory(categoryId)}
                    className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste des catégories disponibles */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-gray-600">Catégories disponibles</span>
        
        <ScrollArea className="h-40">
          <div className="space-y-1">
            {unifiedCategories.map(category => {
              const isSelected = selectedCategories.includes(category.id);
              
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCategoryToggle(category.id)}
                  className={`
                    w-full justify-start h-10 px-3
                    ${isSelected 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <CategoryIcon 
                        iconName={category.icon} 
                        className="w-4 h-4" 
                        color={category.color}
                      />
                    </div>
                    
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  
                  {isSelected ? (
                    <X className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Plus className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default GoogleMapsCategorySelector;