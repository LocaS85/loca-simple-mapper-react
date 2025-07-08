import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { mapboxConfigService } from '@/services/mapboxConfigService';

interface MapboxTokenSetupProps {
  onTokenValidated?: () => void;
}

const MapboxTokenSetup: React.FC<MapboxTokenSetupProps> = ({ onTokenValidated }) => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleValidateToken = async () => {
    if (!token.trim()) {
      setError('Veuillez entrer un token Mapbox');
      return;
    }
    
    if (!token.startsWith('pk.')) {
      setError('Le token doit commencer par "pk."');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const isValid = await mapboxConfigService.validateToken(token);
      
      if (isValid) {
        mapboxConfigService.saveTokenLocally(token);
        setSuccess(true);
        setTimeout(() => {
          onTokenValidated?.();
          window.location.reload();
        }, 1500);
      } else {
        setError('Token invalide. Vérifiez votre clé API Mapbox.');
      }
    } catch (error) {
      setError('Erreur lors de la validation du token');
    } finally {
      setIsValidating(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Token validé avec succès !</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Key className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Configuration Mapbox</CardTitle>
          <CardDescription>
            Entrez votre token d'API Mapbox pour utiliser les services de cartographie
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="token" className="text-sm font-medium">
              Token Mapbox (pk.*)
            </label>
            <Input
              id="token"
              type="text"
              placeholder="pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbDk..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleValidateToken}
              disabled={!token.trim() || isValidating}
              className="flex-1"
            >
              {isValidating ? 'Validation en cours...' : 'Valider le token'}
            </Button>
            
            <Button
              variant="outline"
              asChild
              className="px-3"
            >
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Votre token est stocké localement et de manière sécurisée. 
              Pour une sécurité optimale, configurez-le dans les secrets Supabase.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapboxTokenSetup;