
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface BoutonRetourProps {
  route?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  label?: string;
}

const BoutonRetour: React.FC<BoutonRetourProps> = ({
  route,
  className,
  variant = "outline",
  label
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleClick = () => {
    if (route) {
      navigate(route);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 mb-4 shadow-sm hover:shadow transition-all",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label || t('common.back')}</span>
    </Button>
  );
};

export default BoutonRetour;
