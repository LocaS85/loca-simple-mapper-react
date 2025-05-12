
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
      {categories.map((cat) => (
        <Button
          key={cat.id}
          style={{ backgroundColor: cat.color }}
          className="text-white px-4 py-2 rounded-xl"
          onClick={() => onCategorySelect(cat)}
        >
          {cat.icon} {cat.name}
        </Button>
      ))}
    </div>
  );
};

export default CategorySelector;
