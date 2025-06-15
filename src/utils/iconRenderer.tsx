
import React from 'react';
import { LucideProps } from 'lucide-react';

export type IconType = string | React.ComponentType<LucideProps>;

export const renderIcon = (icon: IconType, color?: string, size?: number): React.ReactNode => {
  if (typeof icon === 'string') {
    return (
      <span 
        style={{ 
          color: color,
          fontSize: size ? `${size}px` : '1em',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {icon}
      </span>
    );
  }
  
  const IconComponent = icon as React.ComponentType<LucideProps>;
  return (
    <IconComponent 
      color={color} 
      size={size} 
      style={{ 
        width: size ? `${size}px` : '1em',
        height: size ? `${size}px` : '1em'
      }}
    />
  );
};
