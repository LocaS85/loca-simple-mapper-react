import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Car, Bike, User, Train, Palette, Check, RotateCcw } from 'lucide-react';
import { TransportMode } from '@/hooks/useSupabaseCategories';
import { motion } from 'framer-motion';

interface ModernTransportManagerProps {
  transportModes: TransportMode[];
  onUpdateColor: (transportModeId: string, color: string) => Promise<void>;
}

const ModernTransportManager: React.FC<ModernTransportManagerProps> = ({
  transportModes,
  onUpdateColor
}) => {
  const [editingMode, setEditingMode] = useState<TransportMode | null>(null);
  const [customColor, setCustomColor] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  // Mapping des icônes modernes pour les modes de transport
  const getTransportIcon = (name: string, mapboxProfile: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Voiture': <Car className="h-5 w-5" />,
      'Vélo': <Bike className="h-5 w-5" />,
      'À pied': <User className="h-5 w-5" />,
      'Transport en commun': <Train className="h-5 w-5" />
    };

    // Recherche par nom exact
    if (iconMap[name]) return iconMap[name];

    // Recherche par profil Mapbox
    switch (mapboxProfile) {
      case 'driving': return <Car className="h-5 w-5" />;
      case 'cycling': return <Bike className="h-5 w-5" />;
      case 'walking': return <User className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  const handleColorUpdate = async () => {
    if (!editingMode || !customColor) return;
    
    await onUpdateColor(editingMode.id, customColor);
    setShowDialog(false);
    setEditingMode(null);
    setCustomColor('');
  };

  const handleResetColor = async (mode: TransportMode) => {
    await onUpdateColor(mode.id, mode.default_color);
  };

  const openColorEditor = (mode: TransportMode) => {
    setEditingMode(mode);
    setCustomColor(mode.custom_color || mode.default_color);
    setShowDialog(true);
  };

  // Couleurs prédéfinies pour un choix rapide
  const presetColors = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
    '#22c55e', // green-500
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#6366f1', // indigo-500
    '#a855f7', // purple-500
    '#ec4899', // pink-500
    '#6b7280', // gray-500
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {transportModes.map((mode, index) => (
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:border-primary/30 group">
            <CardHeader 
              className="pb-3 relative"
              style={{ backgroundColor: `${mode.custom_color || mode.default_color}10` }}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-md relative overflow-hidden"
                    style={{ 
                      backgroundColor: mode.custom_color || mode.default_color,
                      background: `linear-gradient(135deg, ${mode.custom_color || mode.default_color}, ${mode.custom_color || mode.default_color}dd)`
                    }}
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                    <div className="relative z-10">
                      {getTransportIcon(mode.name, mode.mapbox_profile)}
                    </div>
                  </motion.div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{mode.name}</h4>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex flex-col gap-2">
                <div 
                  className="h-3 rounded-full shadow-inner border border-gray-200"
                  style={{ backgroundColor: mode.custom_color || mode.default_color }}
                />
                
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => openColorEditor(mode)}
                  >
                    <Palette className="h-3 w-3 mr-1" />
                    Personnaliser
                  </Button>
                  
                  {mode.custom_color && mode.custom_color !== mode.default_color && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetColor(mode)}
                      className="px-2"
                    >
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingMode && getTransportIcon(editingMode.name, editingMode.mapbox_profile)}
              Personnaliser la couleur - {editingMode?.name}
            </DialogTitle>
            <DialogDescription>
              Choisissez une couleur personnalisée pour ce mode de transport
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Aperçu de la couleur */}
            <div className="flex items-center gap-3">
              <div 
                className="w-16 h-16 rounded-xl shadow-lg border-2 border-white"
                style={{ backgroundColor: customColor }}
              />
              <div className="flex-1">
                <Label htmlFor="colorPicker">Couleur personnalisée</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="colorPicker"
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-16 h-10"
                  />
                  <Input
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    placeholder="#6366f1"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Couleurs prédéfinies */}
            <div>
              <Label>Couleurs populaires</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {presetColors.map((color) => (
                  <motion.button
                    key={color}
                    className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200 relative"
                    style={{ backgroundColor: color }}
                    onClick={() => setCustomColor(color)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {customColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white drop-shadow-md" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleColorUpdate} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Appliquer
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDialog(false)}
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModernTransportManager;