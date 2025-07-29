import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import CategoryIcon from '../components/CategoryIcon';

interface CategoryPillProps {
  id: string;
  name: string;
  icon: string;
  color: string;
  onRemove: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
}

const CategoryPill: React.FC<CategoryPillProps> = ({
  id,
  name,
  icon,
  color,
  onRemove,
  size = 'sm',
  removable = true
}) => {
  return (
    <Badge
      variant="secondary"
      className={`
        flex items-center gap-1.5 transition-all duration-200
        hover:shadow-md hover:scale-105
        ${size === 'sm' ? 'px-2 py-1 text-xs' : ''}
        ${size === 'md' ? 'px-3 py-1.5 text-sm' : ''}
        ${size === 'lg' ? 'px-4 py-2 text-base' : ''}
      `}
      style={{ 
        backgroundColor: `${color}15`, 
        color: color,
        borderColor: `${color}30`
      }}
    >
      <CategoryIcon 
        iconName={icon} 
        className={`
          ${size === 'sm' ? 'w-3 h-3' : ''}
          ${size === 'md' ? 'w-4 h-4' : ''}
          ${size === 'lg' ? 'w-5 h-5' : ''}
        `}
        color={color}
      />
      <span className="font-medium">{name}</span>
      
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label={`Supprimer ${name}`}
        >
          <X className={`
            ${size === 'sm' ? 'h-2.5 w-2.5' : ''}
            ${size === 'md' ? 'h-3 w-3' : ''}
            ${size === 'lg' ? 'h-4 w-4' : ''}
          `} />
        </button>
      )}
    </Badge>
  );
};

export default CategoryPill;