
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { saveMapboxToken, isMapboxTokenValid } from '@/utils/mapboxConfig';

const MapboxSetup: React.FC = () => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveToken = async () => {
    if (!token.trim()) {
      setError('Veuillez entrer un token valide');
      return;
    }

    if (!token.startsWith('pk.')) {
      setError('Le token doit commencer par "pk."');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      // Sauvegarder le token
      saveMapboxToken(token);
      
      // Vérifier si le token est valide
      if (isMapboxTokenValid()) {
        window.location.reload();
      } else {
        setError('Token invalide. Veuillez vérifier votre token.');
      }
    } catch (err) {
      setError('Erreur lors de la validation du token');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Configuration Mapbox
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Un token Mapbox est requis pour utiliser la carte et la recherche géographique.
          </p>
          
          <div className="space-y-2">
            <label htmlFor="mapbox-token" className="text-sm font-medium">
              Token Mapbox
            </label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSaveToken}
              disabled={!token.trim() || isValidating}
              className="flex-1"
            >
              {isValidating ? 'Validation...' : 'Sauvegarder'}
            </Button>
            <Button
              variant="outline"
              asChild
              className="flex-1"
            >
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                Obtenir un token
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Instructions :</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Cliquez sur "Obtenir un token"</li>
              <li>Créez un compte Mapbox gratuit</li>
              <li>Copiez votre token public (pk.xxx)</li>
              <li>Collez-le ci-dessus</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapboxSetup;
