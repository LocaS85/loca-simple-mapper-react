
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { getRouteLabel } from '@/utils/routeUtils';

interface RouteBackButtonProps {
  route?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  label?: string;
  showLabel?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

const RouteBackButton: React.FC<RouteBackButtonProps> = ({
  route,
  className,
  variant = "outline",
  label,
  showLabel = true,
  size = "default"
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const handleClick = () => {
    // Si aucune route spécifique n'est fournie, utiliser l'historique de navigation
    if (!route) {
      navigate(-1);
    } else {
      navigate(route);
    }
  };

  // Get the displayed label
  const displayLabel = label || (route ? getRouteLabel(route) : t('common.back'));

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      size={size}
      className={cn(
        "shadow-sm hover:shadow transition-all",
        !showLabel && "p-2", 
        className
      )}
      aria-label={displayLabel}
    >
      <ArrowLeft className={cn("h-4 w-4", showLabel && "mr-2")} />
      {showLabel && <span>{displayLabel}</span>}
    </Button>
  );
};

export default RouteBackButton;
