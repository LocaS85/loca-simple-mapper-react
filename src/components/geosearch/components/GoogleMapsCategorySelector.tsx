import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { X, Plus, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const handleCategoryToggle = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId);
    
    if (isSelected) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const handleSubcategoryToggle = (subcategoryId: string) => {
    const isSelected = selectedCategories.includes(subcategoryId);
    
    if (isSelected) {
      onChange(selectedCategories.filter(id => id !== subcategoryId));
    } else {
      onChange([...selectedCategories, subcategoryId]);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    onChange(selectedCategories.filter(id => id !== categoryId));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getSelectedItemsFromCategory = (categoryId: string) => {
    const category = unifiedCategories.find(cat => cat.id === categoryId);
    if (!category) return [];
    
    return [
      ...(selectedCategories.includes(categoryId) ? [categoryId] : []),
      ...category.subcategories.filter(sub => selectedCategories.includes(sub.id)).map(sub => sub.id)
    ];
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
              // Vérifier si c'est une catégorie principale
              const category = unifiedCategories.find(cat => cat.id === categoryId);
              if (category) {
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
              }

              // Vérifier si c'est une sous-catégorie
              const subcategory = unifiedCategories
                .flatMap(cat => cat.subcategories)
                .find(sub => sub.id === categoryId);
              
              if (subcategory) {
                const parentCategory = unifiedCategories.find(cat => 
                  cat.subcategories.some(sub => sub.id === categoryId)
                );
                
                return (
                  <Badge
                    key={categoryId}
                    variant="secondary"
                    className="px-2 py-1 text-xs flex items-center gap-1"
                    style={{ 
                      backgroundColor: `${parentCategory?.color || '#gray'}20`, 
                      color: parentCategory?.color || '#gray'
                    }}
                  >
                    <CategoryIcon iconName={subcategory.icon} className="w-3 h-3" />
                    {subcategory.name}
                    <button
                      onClick={() => handleRemoveCategory(categoryId)}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                );
              }

              return null;
            })}
          </div>
        </div>
      )}

      {/* Liste des catégories disponibles */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-gray-600">Catégories disponibles</span>
        
        <ScrollArea className="h-64">
          <div className="space-y-1">
            {unifiedCategories.map(category => {
              const isExpanded = expandedCategories.has(category.id);
              const selectedInCategory = getSelectedItemsFromCategory(category.id);
              const isCategorySelected = selectedCategories.includes(category.id);
              
              return (
                <div key={category.id} className="space-y-1">
                  {/* Catégorie principale */}
                  <Collapsible open={isExpanded} onOpenChange={() => toggleCategoryExpansion(category.id)}>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`
                          flex-1 justify-start h-10 px-3 transition-all duration-200
                          ${isCategorySelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                            : 'text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400'
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
                          
                          {selectedInCategory.length > 0 && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {selectedInCategory.length}
                            </Badge>
                          )}
                        </div>
                      </Button>
                      
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-8 p-0 text-gray-500 hover:text-gray-700"
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    
                    {/* Sous-catégories */}
                    <CollapsibleContent className="ml-6 space-y-1">
                      {category.subcategories.map(subcategory => {
                        const isSubSelected = selectedCategories.includes(subcategory.id);
                        
                        return (
                          <Button
                            key={subcategory.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSubcategoryToggle(subcategory.id)}
                            className={`
                              w-full justify-start h-8 px-3 transition-all duration-200
                              ${isSubSelected
                                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                : 'text-gray-600 hover:bg-gray-50'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <div 
                                className="w-6 h-6 rounded flex items-center justify-center"
                                style={{ backgroundColor: `${category.color}15` }}
                              >
                                <CategoryIcon 
                                  iconName={subcategory.icon} 
                                  className="w-3 h-3" 
                                  color={category.color}
                                />
                              </div>
                              
                              <span className="text-xs">{subcategory.name}</span>
                            </div>
                            
                            {isSubSelected && (
                              <X className="h-3 w-3 text-gray-400" />
                            )}
                          </Button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default GoogleMapsCategorySelector;