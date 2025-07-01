import React from 'react';
import { Loader2, MapPin, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EnhancedLoadingSpinnerProps {
  message?: string;
  type?: 'search' | 'map' | 'default';
  size?: 'sm' | 'md' | 'lg';
  showCard?: boolean;
}

const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({
  message = 'Chargement...',
  type = 'default',
  size = 'md',
  showCard = true
}) => {
  const getIcon = () => {
    switch (type) {
      case 'search':
        return <Search className={`${getSizeClass()} animate-pulse`} />;
      case 'map':
        return <MapPin className={`${getSizeClass()} animate-bounce`} />;
      default:
        return <Loader2 className={`${getSizeClass()} animate-spin`} />;
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-8 w-8';
      default: return 'h-6 w-6';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      default: return 'text-base';
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-4">
      <div className="text-primary">
        {getIcon()}
      </div>
      <p className={`${getTextSize()} text-muted-foreground text-center font-medium`}>
        {message}
      </p>
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="pt-6">
        {content}
      </CardContent>
    </Card>
  );
};

export default EnhancedLoadingSpinner;