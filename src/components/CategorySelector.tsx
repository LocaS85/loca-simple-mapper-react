
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
        // Check if icon is a component function
        const isIconComponent = cat.icon && typeof cat.icon === 'function';
        
        return (
          <Button
            key={cat.id}
            style={{ backgroundColor: cat.color }}
            className="text-white px-4 py-2 rounded-xl"
            onClick={() => onCategorySelect(cat)}
          >
            {isIconComponent ? (
              // Correctly render component icons
              React.createElement(cat.icon as React.ComponentType<any>, { className: "h-4 w-4 mr-1" })
            ) : (
              // Render as React node if not a component
              cat.icon || null
            )}
            {cat.name}
          </Button>
        );
      })}
    </div>
  );
};

export default CategorySelector;
