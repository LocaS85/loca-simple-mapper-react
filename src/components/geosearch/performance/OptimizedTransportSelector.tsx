import React, { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FilterButton, TransportIcon } from '../atoms';
import { TRANSPORT_COLORS } from '../components/GoogleMapsMap';

interface OptimizedTransportSelectorProps {
  value: string;
  onChange: (transport: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  layout?: 'grid' | 'horizontal';
}

const transportModes = [
  { id: 'car', label: 'Voiture', color: TRANSPORT_COLORS.car },
  { id: 'walking', label: 'À pied', color: TRANSPORT_COLORS.walking },
  { id: 'cycling', label: 'Vélo', color: TRANSPORT_COLORS.cycling },
  { id: 'bus', label: 'Transport', color: TRANSPORT_COLORS.bus }
];

const OptimizedTransportSelector: React.FC<OptimizedTransportSelectorProps> = memo(({
  value,
  onChange,
  disabled = false,
  size = 'default',
  layout = 'grid'
}) => {
  const handleTransportClick = useCallback((transportId: string) => {
    if (!disabled) {
      onChange(transportId);
    }
  }, [onChange, disabled]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  }), []);

  const gridClasses = layout === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex gap-2 overflow-x-auto';

  return (
    <motion.div 
      className={gridClasses}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {transportModes.map((mode) => {
        const isSelected = value === mode.id;
        
        return (
          <motion.div
            key={mode.id}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FilterButton
              onClick={() => handleTransportClick(mode.id)}
              isSelected={isSelected}
              disabled={disabled}
              variant="outline"
              size={size}
              color={mode.color}
              className={`
                flex items-center justify-center gap-2 
                ${size === 'sm' ? 'h-10 p-3' : ''}
                ${size === 'default' ? 'h-12 p-4' : ''}
                ${size === 'lg' ? 'h-14 p-5' : ''}
                ${layout === 'horizontal' ? 'min-w-max' : 'w-full'}
                ${isSelected ? 'shadow-lg ring-2 ring-primary/20' : ''}
                transition-all duration-200
              `}
            >
              <TransportIcon 
                mode={mode.id}
                size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md'}
                color={isSelected ? 'white' : mode.color}
              />
              <span className={`
                font-medium
                ${size === 'sm' ? 'text-xs' : ''}
                ${size === 'default' ? 'text-sm' : ''}
                ${size === 'lg' ? 'text-base' : ''}
              `}>
                {mode.label}
              </span>
            </FilterButton>
          </motion.div>
        );
      })}
    </motion.div>
  );
});

OptimizedTransportSelector.displayName = 'OptimizedTransportSelector';

export default OptimizedTransportSelector;