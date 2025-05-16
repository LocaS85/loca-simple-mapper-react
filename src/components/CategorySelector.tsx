
import React, { isValidElement, ComponentType } from "react";
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
        const icon = cat.icon;

        return (
          <Button
            key={cat.id}
            style={{ backgroundColor: cat.color }}
            className={`text-white px-4 py-2 rounded-xl flex items-center gap-2 ${
              selectedCategory?.id === cat.id ? "ring-2 ring-black" : ""
            }`}
            onClick={() => onCategorySelect(cat)}
          >
            {typeof icon === "function"
              ? React.createElement(icon as ComponentType<any>, {
                  className: "h-4 w-4",
                })
              : isValidElement(icon)
              ? icon // un élément JSX valide
              : icon // string ou autre valeur
            }
            {cat.name}
          </Button>
        );
      })}
    </div>
  );
};

export default CategorySelector;
