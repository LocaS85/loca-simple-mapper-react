
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TransportMode, transportModes } from '@/lib/data/transportModes';
import { useTranslation } from 'react-i18next';

interface EnhancedTransportSelectorProps {
  value: TransportMode;
  onChange: (mode: TransportMode) => void;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

const EnhancedTransportSelector: React.FC<EnhancedTransportSelectorProps> = ({
  value,
  onChange,
  className = '',
  size = 'default'
}) => {
  const { t } = useTranslation();

  const sizeClasses = {
    sm: 'h-8 px-2 text-xs',
    default: 'h-10 px-3 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val: TransportMode) => val && onChange(val)}
      className={`justify-start flex-wrap gap-1 ${className}`}
    >
      {transportModes.map((mode) => (
        <ToggleGroupItem
          key={mode.value}
          value={mode.value}
          aria-label={t(`filters.transportModes.${mode.value}`)}
          className={`${sizeClasses[size]} data-[state=on]:bg-blue-600 data-[state=on]:text-white transition-all`}
        >
          <div className="flex items-center gap-2">
            <span>{mode.icon}</span>
            <span className="hidden sm:inline">
              {t(`filters.transportModes.${mode.value}`)}
            </span>
          </div>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export default EnhancedTransportSelector;
