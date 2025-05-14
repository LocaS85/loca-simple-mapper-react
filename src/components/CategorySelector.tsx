
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
        const Icon = typeof cat.icon === 'function' ? cat.icon : null;
        
        return (
          <Button
            key={cat.id}
            style={{ backgroundColor: cat.color }}
            className="text-white px-4 py-2 rounded-xl"
            onClick={() => onCategorySelect(cat)}
          >
            {Icon ? (
              <Icon className="h-4 w-4 mr-1" />
            ) : (
              <span className="mr-2">{cat.icon}</span>
            )}
            {cat.name}
          </Button>
        );
      })}
    </div>
  );
};

export default CategorySelector;
