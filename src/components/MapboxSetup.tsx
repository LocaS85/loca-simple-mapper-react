
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ExternalLink, CheckCircle, Loader2 } from 'lucide-react';
import { saveMapboxToken } from '@/utils/mapboxConfig';
import { validateMapboxToken, testMapboxConnectivity } from '@/utils/mapboxValidation';

const MapboxSetup: React.FC = () => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [connectivity, setConnectivity] = useState<{
    latency?: number;
    success: boolean;
  } | null>(null);

  const handleSaveToken = async () => {
    if (!token.trim()) {
      setError('Veuillez entrer un token valide');
      return;
    }

    if (!token.startsWith('pk.')) {
      setError('Le token doit commencer par "pk." (token public)');
      return;
    }

    setIsValidating(true);
    setError(null);
    setSuccess(null);

    try {
      // Sauvegarder le token
      saveMapboxToken(token);
      
      // Tester la validité
      const isValid = await validateMapboxToken(token);
      
      if (isValid) {
        setSuccess('Token validé avec succès !');
        
        // Test de connectivité
        setIsTesting(true);
        const connectivityTest = await testMapboxConnectivity();
        setConnectivity(connectivityTest);
        setIsTesting(false);
        
        // Recharger après un délai
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError('Token invalide. Vérifiez votre token Mapbox.');
      }
    } catch (err) {
      setError('Erreur lors de la validation du token');
      console.error('Erreur validation:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleTestConnectivity = async () => {
    if (!token.trim()) return;
    
    setIsTesting(true);
    try {
      const result = await testMapboxConnectivity();
      setConnectivity(result);
    } catch (error) {
      console.error('Erreur test connectivité:', error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Configuration Mapbox
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600 space-y-2">
            <p>Un token Mapbox est requis pour utiliser la carte et la recherche géographique.</p>
            <p className="font-medium">Le token doit être un token <strong>public</strong> (commence par "pk.").</p>
          </div>
          
          <div className="space-y-3">
            <label htmlFor="mapbox-token" className="text-sm font-medium">
              Token Mapbox Public
            </label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={error ? 'border-red-500' : success ? 'border-green-500' : ''}
            />
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            )}
            
            {connectivity && (
              <div className={`text-sm p-3 rounded-lg ${
                connectivity.success 
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {connectivity.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span className="font-medium">
                    {connectivity.success ? 'Connectivité API réussie' : 'Problème de connectivité'}
                  </span>
                </div>
                {connectivity.latency && (
                  <p className="text-xs mt-1">Latence: {connectivity.latency}ms</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Button
                onClick={handleSaveToken}
                disabled={!token.trim() || isValidating}
                className="flex-1"
              >
                {isValidating ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validation...
                  </div>
                ) : (
                  'Sauvegarder et Valider'
                )}
              </Button>
              
              {token.trim() && (
                <Button
                  variant="outline"
                  onClick={handleTestConnectivity}
                  disabled={isTesting}
                  className="shrink-0"
                >
                  {isTesting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Test'
                  )}
                </Button>
              )}
            </div>
            
            <Button
              variant="outline"
              asChild
              className="w-full"
            >
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Obtenir un token Mapbox
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-2 border-t pt-4">
            <p><strong>Instructions rapides :</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Cliquez sur "Obtenir un token Mapbox"</li>
              <li>Créez un compte Mapbox gratuit</li>
              <li>Copiez votre token public (pk.xxx)</li>
              <li>Collez-le ci-dessus et validez</li>
            </ol>
            <p className="text-xs text-amber-600 mt-3">
              ⚠️ Utilisez uniquement des tokens publics (pk.) pour le frontend
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapboxSetup;
