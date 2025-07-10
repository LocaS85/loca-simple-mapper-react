
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DailyAddressData, TransportMode } from '@/types/unified';

interface DailyAddressFormProps {
  onSave: (address: Partial<DailyAddressData>) => void;
  onCancel: () => void;
  initialData?: Partial<DailyAddressData>;
}

const transportModes = [
  { id: 'driving', name: 'Voiture', icon: '🚗' },
  { id: 'walking', name: 'À pied', icon: '🚶' },
  { id: 'cycling', name: 'Vélo', icon: '🚴' },
  { id: 'transit', name: 'Transport en commun', icon: '🚌' }
];

const DailyAddressForm: React.FC<DailyAddressFormProps> = ({
  onSave,
  onCancel,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<Partial<DailyAddressData>>({
    name: '',
    address: '',
    transport: 'walking' as TransportMode,
    ...initialData
  });
  const [distance, setDistance] = useState<number>(5);

  const handleChange = (field: keyof DailyAddressData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      // Include other form fields like distance preferences
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l'adresse</Label>
        <Input
          id="name"
          placeholder="Ex: Maison, Bureau, Chez Papa..."
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Adresse complète</Label>
        <Input
          id="address"
          placeholder="Ex: 123 Rue des Exemples, 75000 Paris"
          value={formData.address || ''}
          onChange={(e) => handleChange('address', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="transport-mode">Mode de transport préféré</Label>
        <Select
          value={formData.transport || 'walking'}
          onValueChange={(value) => handleChange('transport', value as TransportMode)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un mode de transport" />
          </SelectTrigger>
          <SelectContent>
            {transportModes.map(mode => (
              <SelectItem key={mode.id} value={mode.id}>
                <div className="flex items-center">
                  <span className="mr-2">{mode.icon}</span>
                  <span>{mode.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Distance maximale</Label>
        <div className="flex items-center gap-4">
          <Slider
            className="flex-1"
            min={1}
            max={20}
            step={0.5}
            value={[distance]}
            onValueChange={(values) => setDistance(values[0])}
          />
          <span className="w-12 text-center font-medium">{distance} km</span>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default DailyAddressForm;
