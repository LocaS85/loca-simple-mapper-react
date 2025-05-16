import React from "react";
import { Button } from "@/components/ui/button";
import { Category } from "../types";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: Category | null;
  onCategorySelect: (cat: Category) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        // Vérifie si l'icône est un composant React
        const isIconComponent = cat.icon && typeof cat.icon === 'function';
        
        return (
          <Button
            key={cat.id}
            style={{ backgroundColor: cat.color }}
            className="text-white px-4 py-2 rounded-xl"
            onClick={() => onCategorySelect(cat)}
          >
            <span className="flex items-center">
              {isIconComponent ? (
                // Rend correctement les icônes composants
                React.createElement(cat.icon as React.ComponentType, { className: "h-4 w-4 mr-1" })
              ) : (
                // Rend l'icône directement si c'est un ReactNode (string, number, JSX, etc.)
                cat.icon ? <span className="h-4 w-4 mr-1">{cat.icon}</span> : null
              )}
              {cat.name}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default CategorySelector;