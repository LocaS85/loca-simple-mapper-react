import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Navigation, Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddressSelectorProps {
  userLocation: [number, number] | null;
  selectedAddress: string | null;
  onAddressChange: (address: string, coordinates: [number, number]) => void;
  className?: string;
}

type AddressMode = 'gps' | 'custom' | 'search';

const AddressSelector: React.FC<AddressSelectorProps> = ({
  userLocation,
  selectedAddress,
  onAddressChange,
  className
}) => {
  const [addressMode, setAddressMode] = useState<AddressMode>('gps');
  const [customAddress, setCustomAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleGPSLocation = async () => {
    if (!userLocation) {
      // Demander la géolocalisation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
            onAddressChange('Position actuelle', coords);
          },
          (error) => {
            console.error('Erreur géolocalisation:', error);
          }
        );
      }
    } else {
      onAddressChange('Position actuelle', userLocation);
    }
  };

  const handleCustomAddressSubmit = async () => {
    if (!customAddress.trim()) return;
    
    try {
      setIsGeocoding(true);
      // Ici on utiliserait un service de géocodage pour convertir l'adresse en coordonnées
      // Pour le moment, on utilise des coordonnées par défaut
      const mockCoords: [number, number] = [2.3522, 48.8566]; // Paris
      onAddressChange(customAddress, mockCoords);
    } catch (error) {
      console.error('Erreur géocodage:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Choisir une adresse de départ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup value={addressMode} onValueChange={(value) => setAddressMode(value as AddressMode)}>
          {/* Position GPS */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="gps" id="gps" />
            <Label htmlFor="gps" className="flex-1 flex items-center gap-2 cursor-pointer">
              <Navigation className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium">Ma position actuelle</div>
                <div className="text-sm text-muted-foreground">
                  {userLocation ? 'Position détectée' : 'Cliquer pour localiser'}
                </div>
              </div>
            </Label>
            {addressMode === 'gps' && (
              <Button 
                size="sm" 
                onClick={handleGPSLocation}
                variant="outline"
                className="ml-auto"
              >
                <Navigation className="h-4 w-4 mr-1" />
                Localiser
              </Button>
            )}
          </div>

          {/* Adresse personnalisée */}
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium">Adresse personnalisée</div>
                  <div className="text-sm text-muted-foreground">
                    Entrer une adresse spécifique
                  </div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Champ d'adresse personnalisée */}
        {addressMode === 'custom' && (
          <div className="space-y-2 ml-6">
            <Input
              placeholder="Entrer votre adresse..."
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomAddressSubmit()}
            />
            <Button 
              onClick={handleCustomAddressSubmit} 
              disabled={!customAddress.trim() || isGeocoding}
              size="sm"
              className="w-full"
            >
              {isGeocoding ? 'Recherche...' : 'Confirmer l\'adresse'}
            </Button>
          </div>
        )}

        {/* Adresse sélectionnée */}
        {selectedAddress && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-medium text-primary">Adresse sélectionnée</div>
                <div className="text-sm text-muted-foreground">{selectedAddress}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddressSelector;