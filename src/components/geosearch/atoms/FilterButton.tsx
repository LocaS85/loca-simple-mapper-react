import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface FilterButtonProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'lg' | 'default';
  color?: string;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  icon: Icon,
  children,
  isSelected = false,
  onClick,
  disabled = false,
  variant = 'outline',
  size = 'default',
  color,
  className = ''
}) => {
  return (
    <Button
      variant={isSelected ? "default" : variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2 
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        ${size === 'sm' ? 'h-8 px-3 text-xs' : ''}
        ${size === 'default' ? 'h-10 px-4 text-sm' : ''}
        ${size === 'lg' ? 'h-12 px-6 text-base' : ''}
        ${isSelected && color ? 'text-white shadow-lg' : ''}
        ${className}
      `}
      style={isSelected && color ? { 
        backgroundColor: color,
        borderColor: color
      } : {}}
    >
      {Icon && (
        <Icon 
          className={`
            ${size === 'sm' ? 'h-3 w-3' : ''}
            ${size === 'default' ? 'h-4 w-4' : ''}
            ${size === 'lg' ? 'h-5 w-5' : ''}
          `}
          style={!isSelected && color ? { color } : {}}
        />
      )}
      {children}
    </Button>
  );
};

export default FilterButton;