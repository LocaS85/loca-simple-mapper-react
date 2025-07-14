import React from 'react';
import { cn } from '@/lib/utils';
import logoProposal1 from '@/assets/logo-proposal-1.png';

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
      {/* Logo moderne LS */}
      <div className={cn('relative', config.icon)}>
        <img 
          src={logoProposal1}
          alt="LS Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Texte optionnel */}
      {showText && (
        <span className={cn(
          'font-bold tracking-tight bg-white/80 px-2 py-1 rounded backdrop-blur-sm',
          config.text,
          colors.text
        )}>
          LocaSimple
        </span>
      )}
    </div>
  );
};

export default Logo;