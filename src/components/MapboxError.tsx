
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface MapboxErrorProps {
  onRetry?: () => void;
}

export const MapboxError: React.FC<MapboxErrorProps> = ({ onRetry }) => {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-xl text-red-600">Configuration de la carte manquante</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Il semble que la configuration de Mapbox ne soit pas complète. Veuillez vérifier que :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>La variable d'environnement <code className="bg-gray-100 px-1 rounded">VITE_MAPBOX_TOKEN</code> est définie</li>
            <li>Le fichier CSS de Mapbox est bien chargé depuis le CDN</li>
            <li>La connexion Internet est active</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="default" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={onRetry}
          >
            Réessayer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
