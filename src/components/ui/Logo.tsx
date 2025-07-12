import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'white' | 'dark';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'primary', 
  showText = true,
  className 
}) => {
  const sizeConfig = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', container: 'gap-2' },
    md: { icon: 'w-8 h-8', text: 'text-xl', container: 'gap-2' },
    lg: { icon: 'w-10 h-10', text: 'text-2xl', container: 'gap-3' }
  };

  const colorConfig = {
    primary: {
      icon: 'text-primary',
      text: 'text-primary',
      gradient: 'from-primary to-blue-600'
    },
    white: {
      icon: 'text-white',
      text: 'text-white',
      gradient: 'from-white to-gray-100'
    },
    dark: {
      icon: 'text-gray-900',
      text: 'text-gray-900',
      gradient: 'from-gray-900 to-gray-700'
    }
  };

  const config = sizeConfig[size];
  const colors = colorConfig[variant];

  return (
    <div className={cn(
      'flex items-center font-bold transition-all duration-200 hover:scale-105',
      config.container,
      className
    )}>
      {/* Icône de localisation moderne */}
      <div className={cn('relative', config.icon)}>
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Cercle principal */}
          <circle 
            cx="16" 
            cy="16" 
            r="12" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            fill="none"
            className="animate-pulse"
          />
          
          {/* Pin de localisation central */}
          <path 
            d="M16 8C13.79 8 12 9.79 12 12C12 15 16 20 16 20S20 15 20 12C20 9.79 18.21 8 16 8ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12S15.17 10.5 16 10.5S17.5 11.17 17.5 12S16.83 13.5 16 13.5Z" 
            fill="currentColor"
          />
          
          {/* Points de navigation */}
          <circle cx="8" cy="16" r="1.5" fill="currentColor" className="opacity-60" />
          <circle cx="24" cy="16" r="1.5" fill="currentColor" className="opacity-60" />
          <circle cx="16" cy="8" r="1" fill="currentColor" className="opacity-40" />
          <circle cx="16" cy="24" r="1" fill="currentColor" className="opacity-40" />
        </svg>
      </div>

      {/* Texte du logo */}
      {showText && (
        <span className={cn(
          'font-bold tracking-tight',
          config.text,
          colors.text
        )}>
          <span className="bg-gradient-to-r bg-clip-text text-transparent from-blue-600 to-purple-600">LS</span>
        </span>
      )}
    </div>
  );
};

export default Logo;