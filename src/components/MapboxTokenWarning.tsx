
import React, { useState } from 'react';
import { validateMapboxToken } from '@/utils/mapboxValidation';

interface MapboxTokenWarningProps {
  onTokenUpdate?: (token: string) => void;
}

export const MapboxTokenWarning: React.FC<MapboxTokenWarningProps> = ({ onTokenUpdate }) => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);

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
