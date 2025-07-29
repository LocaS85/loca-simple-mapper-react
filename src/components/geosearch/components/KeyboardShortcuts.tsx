import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Keyboard, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface KeyboardShortcut {
  key: string;
  description: string;
  category: string;
  action?: () => void;
}

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleMultiRoutes?: () => void;
  onRecalculate?: () => void;
  onExportPDF?: () => void;
  onOpenFilters?: () => void;
  onFocusSearch?: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  isOpen,
  onClose,
  onToggleMultiRoutes,
  onRecalculate,
  onExportPDF,
  onOpenFilters,
  onFocusSearch
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const shortcuts: KeyboardShortcut[] = [
    // Navigation
    { key: '/', description: 'Rechercher', category: 'Navigation', action: onFocusSearch },
    { key: 'Échap', description: 'Fermer modal/panneau', category: 'Navigation' },
    { key: '?', description: 'Afficher ce guide', category: 'Navigation' },
    
    // Recherche et filtres
    { key: 'F', description: 'Ouvrir les filtres', category: 'Filtres', action: onOpenFilters },
    { key: 'R', description: 'Recalculer les itinéraires', category: 'Filtres', action: onRecalculate },
    { key: 'T', description: 'Basculer tracés multiples', category: 'Filtres', action: onToggleMultiRoutes },
    
    // Actions
    { key: 'E', description: 'Exporter en PDF', category: 'Actions', action: onExportPDF },
    { key: 'S', description: 'Partager la recherche', category: 'Actions' },
    { key: 'L', description: 'Activer géolocalisation', category: 'Actions' },
    
    // Transport (chiffres)
    { key: '1', description: 'Mode à pied', category: 'Transport' },
    { key: '2', description: 'Mode vélo', category: 'Transport' },
    { key: '3', description: 'Mode voiture', category: 'Transport' },
    { key: '4', description: 'Mode transport public', category: 'Transport' },
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ne pas intercepter si on est dans un input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = event.key;
      setPressedKey(key);
      
      // Reset après un délai
      setTimeout(() => setPressedKey(null), 200);

      // Empêcher le comportement par défaut pour nos raccourcis
      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase() === key.toLowerCase() || 
        (s.key === 'Échap' && key === 'Escape')
      );

      if (shortcut) {
        event.preventDefault();
        
        // Actions spéciales
        switch (key.toLowerCase()) {
          case 'escape':
            onClose();
            break;
          case '?':
            // Le modal est déjà géré par le parent
            break;
          case '/':
            onFocusSearch?.();
            break;
          case 'f':
            onOpenFilters?.();
            break;
          case 'r':
            onRecalculate?.();
            break;
          case 't':
            onToggleMultiRoutes?.();
            break;
          case 'e':
            onExportPDF?.();
            break;
          case 's':
            // Partage sera géré par le parent
            break;
          case 'l':
            // Géolocalisation sera gérée par le parent
            break;
          case '1':
          case '2':
          case '3':
          case '4':
            // Changement de transport sera géré par le parent
            break;
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onFocusSearch, onOpenFilters, onRecalculate, onToggleMultiRoutes, onExportPDF]);

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const getKeyDisplay = (key: string) => {
    const specialKeys: Record<string, string> = {
      'Échap': 'Esc',
      ' ': 'Space'
    };
    return specialKeys[key] || key;
  };

  const isKeyPressed = (key: string) => {
    return pressedKey?.toLowerCase() === key.toLowerCase() || 
           (key === 'Échap' && pressedKey === 'Escape');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Keyboard className="h-5 w-5 text-primary" />
              </div>
              Raccourcis clavier
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center text-muted-foreground">
            <p>Utilisez ces raccourcis pour naviguer plus rapidement</p>
          </div>

          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-lg border-b pb-2">{category}</h3>
              <div className="grid grid-cols-1 gap-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <motion.div
                    key={`${category}-${index}`}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                      isKeyPressed(shortcut.key)
                        ? 'bg-primary/10 border-primary scale-105'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <Badge 
                      variant={isKeyPressed(shortcut.key) ? "default" : "secondary"}
                      className="font-mono min-w-[2rem] justify-center"
                    >
                      {getKeyDisplay(shortcut.key)}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">💡 Conseils :</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Les raccourcis ne fonctionnent pas quand vous tapez dans un champ</li>
              <li>• Appuyez sur <kbd className="px-1 bg-white rounded">?</kbd> à tout moment pour voir ce guide</li>
              <li>• Utilisez <kbd className="px-1 bg-white rounded">Échap</kbd> pour fermer n'importe quel panneau</li>
              <li>• Les chiffres 1-4 changent rapidement le mode de transport</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <Button onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcuts;