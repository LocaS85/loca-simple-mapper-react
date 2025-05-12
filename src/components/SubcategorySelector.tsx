
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SubcategorySelectorProps {
  subcategories: string[];
}

const SubcategorySelector: React.FC<SubcategorySelectorProps> = ({
  subcategories,
}) => {
  if (!subcategories.length) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex gap-2 overflow-x-auto pt-2"
    >
      {subcategories.map((sub) => (
        <Button key={sub} className="bg-gray-200 text-gray-800 rounded-xl px-3 py-1">
          {sub}
        </Button>
      ))}
    </motion.div>
  );
};

export default SubcategorySelector;
