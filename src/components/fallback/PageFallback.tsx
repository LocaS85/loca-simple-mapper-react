import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

interface PageFallbackProps {
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showReloadButton?: boolean;
  onRetry?: () => void;
}

const PageFallback: React.FC<PageFallbackProps> = ({
  title = "Une erreur s'est produite",
  message = "Impossible de charger cette page",
  showHomeButton = true,
  showReloadButton = true,
  onRetry
}) => {
  const handleReload = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-red-600 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-center">
          {showReloadButton && (
            <Button onClick={handleReload} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Réessayer
            </Button>
          )}
          
          {showHomeButton && (
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Accueil
              </Link>
            </Button>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>Si le problème persiste, essayez de :</p>
          <ul className="text-left mt-2 space-y-1">
            <li>• Recharger la page</li>
            <li>• Vider le cache du navigateur</li>
            <li>• Vérifier votre connexion internet</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PageFallback;