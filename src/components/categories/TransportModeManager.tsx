import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Palette } from 'lucide-react';
import { TransportMode } from '@/hooks/useSupabaseCategories';

interface TransportModeManagerProps {
  transportModes: TransportMode[];
  onUpdateColor: (transportModeId: string, color: string) => Promise<void>;
}

const PRESET_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#C026D3', '#E11D48', '#DC2626', '#EA580C',
  '#D97706', '#CA8A04', '#65A30D', '#16A34A', '#059669', '#0D9488',
  '#0891B2', '#0284C7', '#2563EB', '#4F46E5', '#7C3AED', '#9333EA',
  '#A21CAF', '#BE185D', '#000000', '#374151', '#6B7280', '#9CA3AF'
];

const TransportModeManager: React.FC<TransportModeManagerProps> = ({
  transportModes,
  onUpdateColor
}) => {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const handleColorChange = async (transportModeId: string, color: string) => {
    await onUpdateColor(transportModeId, color);
    setShowColorPicker(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Modes de Transport
        </CardTitle>
        <CardDescription>
          Personnalisez les couleurs de vos modes de transport préférés
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {transportModes.map((mode) => (
            <div
              key={mode.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{mode.icon}</span>
                <span className="font-medium text-sm">{mode.name}</span>
              </div>
              
              <Dialog 
                open={showColorPicker === mode.id} 
                onOpenChange={(open) => setShowColorPicker(open ? mode.id : null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 border-2"
                    style={{ 
                      backgroundColor: mode.custom_color || mode.default_color,
                      borderColor: mode.custom_color || mode.default_color
                    }}
                  >
                    <Palette className="h-3 w-3 text-white" />
                  </Button>
                </DialogTrigger>
                
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Couleur pour {mode.icon} {mode.name}
                    </DialogTitle>
                    <DialogDescription>
                      Choisissez une couleur pour ce mode de transport
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Couleur actuelle */}
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div
                        className="w-8 h-8 rounded border-2"
                        style={{ backgroundColor: mode.custom_color || mode.default_color }}
                      />
                      <span className="text-sm">Couleur actuelle</span>
                    </div>

                    {/* Palette de couleurs */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Choisir une nouvelle couleur :
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {PRESET_COLORS.map((color) => (
                          <Button
                            key={color}
                            variant="outline"
                            className="w-8 h-8 p-0 border-2"
                            style={{ backgroundColor: color, borderColor: color }}
                            onClick={() => handleColorChange(mode.id, color)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Couleur par défaut */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleColorChange(mode.id, mode.default_color)}
                        className="flex-1"
                      >
                        Rétablir par défaut
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowColorPicker(null)}
                        className="flex-1"
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Astuce :</strong> Les couleurs personnalisées seront utilisées 
            pour afficher les trajets sur la carte dans l'application GeoSearch.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportModeManager;