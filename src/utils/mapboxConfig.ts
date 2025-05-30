
import React from 'react';

// Configuration Mapbox optimisée avec validation

export const getMapboxToken = (): string => {
  // Nouvelle clé API Mapbox mise à jour
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
                import.meta.env.MAPBOX_ACCESS_TOKEN ||
                'sk.eyJ1IjoibG9jYXNpbXBsZSIsImEiOiJjbWJiMWVqN28xNHJ3MmtwOTdzdXByMmYxIn0.YI7eowiGblU8h37_UDGI8g';

  if (!token) {
    console.error('⚠️ MAPBOX TOKEN MANQUANT! Veuillez configurer VITE_MAPBOX_ACCESS_TOKEN');
    throw new Error('Token Mapbox non configuré');
  }

  // Validation basique du format du token (accepter sk. et pk.)
  if (!token.startsWith('pk.') && !token.startsWith('sk.')) {
    console.warn('⚠️ Format de token Mapbox suspect:', token.substring(0, 10) + '...');
  }

  return token;
};

// Fonction de validation du token Mapbox
export const isMapboxTokenValid = (): boolean => {
  try {
    const token = getMapboxToken();
    return token && (token.startsWith('pk.') || token.startsWith('sk.')) && token.length > 50;
  } catch (error) {
    console.error('Token Mapbox invalide:', error);
    return false;
  }
};

// Configuration des styles de carte disponibles
export const MAPBOX_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satelliteStreets: 'mapbox://styles/mapbox/satellite-streets-v12',
  navigation: 'mapbox://styles/mapbox/navigation-day-v1',
  navigationNight: 'mapbox://styles/mapbox/navigation-night-v1'
} as const;

// Configuration par défaut pour la France
export const FRANCE_BOUNDS = {
  bbox: [-5.559, 41.26, 9.662, 51.312] as [number, number, number, number],
  center: [2.3522, 48.8566] as [number, number], // Paris
  zoom: 6
};

// Valeurs par défaut pour la carte
export const DEFAULT_MAP_CENTER: [number, number] = [2.3522, 48.8566]; // Paris
export const DEFAULT_MAP_ZOOM = 12;

// Configuration des limites de recherche
export const SEARCH_CONFIG = {
  minQueryLength: 2,
  maxResults: 8,
  debounceMs: 300,
  timeoutMs: 10000,
  retryAttempts: 2
};

// Validation du token au démarrage
export const validateMapboxToken = async (token: string): Promise<boolean> => {
  try {
    // Utiliser une URL d'API différente selon le type de token
    let testUrl: string;
    if (token.startsWith('sk.')) {
      // Pour les tokens secrets, utiliser l'API Tokens
      testUrl = `https://api.mapbox.com/tokens/v2?access_token=${token}`;
    } else {
      // Pour les tokens publics, utiliser l'API Geocoding
      testUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}&limit=1`;
    }
    
    const response = await fetch(testUrl);
    const isValid = response.status !== 401 && response.status !== 403;
    
    if (isValid) {
      console.log('✅ Token Mapbox validé avec succès');
    } else {
      console.error('❌ Token Mapbox invalide - Statut:', response.status);
    }
    
    return isValid;
  } catch (error) {
    console.error('Erreur de validation du token Mapbox:', error);
    return false;
  }
};

// Composant d'avertissement pour token invalide
export const MapboxTokenWarning: React.FC<{ onTokenUpdate?: (token: string) => void }> = ({ onTokenUpdate }) => {
  const [token, setToken] = React.useState('');
  const [isValidating, setIsValidating] = React.useState(false);

  const handleValidateToken = async () => {
    if (!token.trim()) return;
    
    setIsValidating(true);
    const isValid = await validateMapboxToken(token);
    
    if (isValid) {
      localStorage.setItem('MAPBOX_ACCESS_TOKEN', token);
      onTokenUpdate?.(token);
      window.location.reload();
    } else {
      alert('Token Mapbox invalide. Veuillez vérifier votre token.');
    }
    setIsValidating(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Configuration Mapbox requise</h3>
        <p className="text-sm text-gray-600 mb-4">
          Le token Mapbox actuel n'est pas valide. Veuillez entrer votre token Mapbox pour continuer.
        </p>
        <input
          type="text"
          placeholder="sk.eyJ1... ou pk.eyJ1..."
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex gap-2">
          <button
            onClick={handleValidateToken}
            disabled={!token.trim() || isValidating}
            className="flex-1 bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          >
            {isValidating ? 'Validation...' : 'Valider'}
          </button>
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gray-500 text-white p-2 rounded text-center"
          >
            Obtenir un token
          </a>
        </div>
      </div>
    </div>
  );
};

// Fonction pour initialiser et tester la connexion Mapbox
export const initializeMapboxConnection = async (): Promise<boolean> => {
  try {
    const token = getMapboxToken();
    console.log('🚀 Initialisation de la connexion Mapbox...');
    
    const isValid = await validateMapboxToken(token);
    
    if (isValid) {
      console.log('✅ Connexion Mapbox établie avec succès');
      return true;
    } else {
      console.error('❌ Échec de la connexion Mapbox');
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation Mapbox:', error);
    return false;
  }
};
