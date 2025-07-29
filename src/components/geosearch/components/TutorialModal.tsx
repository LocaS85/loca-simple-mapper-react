import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Search, 
  Route, 
  MapPin, 
  Filter,
  Share2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
  tips?: string[];
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic?: 'general' | 'multiRoutes' | 'filters' | 'sharing';
}

const tutorialSteps: Record<string, TutorialStep[]> = {
  general: [
    {
      id: 'search',
      title: 'Recherche géographique',
      description: 'Trouvez des lieux autour de vous facilement',
      icon: Search,
      content: (
        <div className="space-y-4">
          <p>Utilisez la barre de recherche pour trouver des lieux, adresses ou points d'intérêt.</p>
          <div className="bg-muted p-3 rounded">
            <p className="font-medium mb-2">Exemples de recherches :</p>
            <ul className="text-sm space-y-1">
              <li>• "restaurant italien près de moi"</li>
              <li>• "pharmacie ouverte"</li>
              <li>• "parking gratuit"</li>
              <li>• "Place de la République, Paris"</li>
            </ul>
          </div>
        </div>
      ),
      tips: ['Soyez spécifique dans vos recherches', 'Utilisez des mots-clés en français']
    },
    {
      id: 'location',
      title: 'Position et navigation',
      description: 'Activez votre géolocalisation pour de meilleurs résultats',
      icon: MapPin,
      content: (
        <div className="space-y-4">
          <p>Permettez à l'application d'accéder à votre position pour :</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Afficher les lieux les plus proches</li>
            <li>Calculer les itinéraires précis</li>
            <li>Estimer les temps de trajet</li>
            <li>Filtrer par distance</li>
          </ul>
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
            <p className="text-sm">💡 Cliquez sur le bouton de géolocalisation pour activer votre position</p>
          </div>
        </div>
      ),
      tips: ['Autorisez la géolocalisation pour une meilleure expérience', 'Votre position n\'est jamais partagée']
    },
    {
      id: 'filters',
      title: 'Filtres et options',
      description: 'Personnalisez vos recherches avec les filtres',
      icon: Filter,
      content: (
        <div className="space-y-4">
          <p>Utilisez les filtres pour affiner vos résultats :</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded p-3">
              <h4 className="font-medium">Transport</h4>
              <p className="text-sm text-muted-foreground">À pied, vélo, voiture, transport public</p>
            </div>
            <div className="border rounded p-3">
              <h4 className="font-medium">Distance</h4>
              <p className="text-sm text-muted-foreground">Rayon de recherche personnalisable</p>
            </div>
            <div className="border rounded p-3">
              <h4 className="font-medium">Catégories</h4>
              <p className="text-sm text-muted-foreground">Restaurants, santé, shopping, etc.</p>
            </div>
            <div className="border rounded p-3">
              <h4 className="font-medium">Nombre</h4>
              <p className="text-sm text-muted-foreground">Combien de résultats afficher</p>
            </div>
          </div>
        </div>
      ),
      tips: ['Changez le mode de transport pour des résultats différents', 'Ajustez la distance selon vos besoins']
    }
  ],
  multiRoutes: [
    {
      id: 'intro',
      title: 'Tracés multiples',
      description: 'Comparez plusieurs itinéraires en même temps',
      icon: Route,
      content: (
        <div className="space-y-4">
          <p>Les tracés multiples vous permettent de :</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Voir tous les modes de transport disponibles</li>
            <li>Comparer les temps et distances</li>
            <li>Choisir le meilleur itinéraire</li>
            <li>Visualiser les alternatives</li>
          </ul>
          <div className="bg-green-50 p-3 rounded border-l-4 border-green-500">
            <p className="text-sm">🚀 Activez cette fonctionnalité depuis les paramètres ou en cliquant sur l'icône Route</p>
          </div>
        </div>
      ),
      tips: ['Parfait pour planifier vos déplacements', 'Compare automatiquement tous les modes']
    },
    {
      id: 'comparison',
      title: 'Tableau comparatif',
      description: 'Analysez les différences entre les itinéraires',
      icon: Route,
      content: (
        <div className="space-y-4">
          <p>Le tableau de comparaison affiche :</p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs">⚡</div>
              <span className="text-sm">Le plus rapide - Temps minimum</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">📏</div>
              <span className="text-sm">Le plus court - Distance minimum</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">💰</div>
              <span className="text-sm">Le moins cher - Coût estimé</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">🌱</div>
              <span className="text-sm">Le plus écologique - Émissions CO₂</span>
            </div>
          </div>
        </div>
      ),
      tips: ['Cliquez sur un itinéraire pour le sélectionner', 'Les badges colorés indiquent les recommandations']
    }
  ],
  sharing: [
    {
      id: 'share',
      title: 'Partage de recherches',
      description: 'Partagez vos découvertes avec d\'autres',
      icon: Share2,
      content: (
        <div className="space-y-4">
          <p>Partagez facilement vos recherches :</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded p-3">
              <h4 className="font-medium flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Lien complet
              </h4>
              <p className="text-sm text-muted-foreground">Inclut résultats et préférences</p>
            </div>
            <div className="border rounded p-3">
              <h4 className="font-medium flex items-center gap-2">
                <Route className="h-4 w-4" />
                Lien rapide
              </h4>
              <p className="text-sm text-muted-foreground">Paramètres de recherche uniquement</p>
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm">📱 Générez un QR code pour partage mobile instantané</p>
          </div>
        </div>
      ),
      tips: ['Personnalisez le message avant de partager', 'Les liens expirent après 7 jours par défaut']
    },
    {
      id: 'export',
      title: 'Export PDF',
      description: 'Sauvegardez vos itinéraires en PDF',
      icon: Download,
      content: (
        <div className="space-y-4">
          <p>Exportez vos recherches et itinéraires :</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Carte avec tracés colorés</li>
            <li>Tableau comparatif des itinéraires</li>
            <li>Détails des lieux trouvés</li>
            <li>Légende explicative</li>
          </ul>
          <div className="bg-purple-50 p-3 rounded border-l-4 border-purple-500">
            <p className="text-sm">🎨 Les tracés multiples sont inclus avec des couleurs différentes</p>
          </div>
        </div>
      ),
      tips: ['Parfait pour documenter vos recherches', 'Inclut automatiquement tous les tracés actifs']
    }
  ]
};

const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  topic = 'general'
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = tutorialSteps[topic] || tutorialSteps.general;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const closeAndReset = () => {
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen) return null;

  const current = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={closeAndReset}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <current.icon className="h-5 w-5 text-primary" />
              </div>
              Guide d'utilisation
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={closeAndReset}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicator */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-primary' 
                    : index < currentStep
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Current step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{current.title}</h3>
                <p className="text-muted-foreground">{current.description}</p>
              </div>

              <div className="bg-muted/30 p-6 rounded-lg">
                {current.content}
              </div>

              {/* Tips */}
              {current.tips && current.tips.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Conseils :</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {current.tips.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {currentStep + 1} / {steps.length}
              </Badge>
            </div>

            {currentStep < steps.length - 1 ? (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={closeAndReset} className="flex items-center gap-2">
                Terminer
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialModal;