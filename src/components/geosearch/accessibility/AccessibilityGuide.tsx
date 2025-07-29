import React from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Keyboard, 
  Eye, 
  Volume2, 
  MousePointer, 
  Smartphone,
  Monitor,
  Info
} from 'lucide-react';

interface AccessibilityGuideProps {
  onClose: () => void;
}

const AccessibilityGuide: React.FC<AccessibilityGuideProps> = ({ onClose }) => {
  const { t } = useTranslations();

  const shortcuts = [
    { key: 'Tab', action: t('accessibility.shortcuts.tab') },
    { key: 'Enter/Space', action: t('accessibility.shortcuts.activate') },
    { key: 'Escape', action: t('accessibility.shortcuts.close') },
    { key: 'Arrow Keys', action: t('accessibility.shortcuts.navigate') },
    { key: 'Ctrl + F', action: t('accessibility.shortcuts.search') },
    { key: 'Alt + M', action: t('accessibility.shortcuts.map') }
  ];

  const features = [
    {
      icon: <Keyboard className="h-5 w-5" />,
      title: t('accessibility.features.keyboard.title'),
      description: t('accessibility.features.keyboard.description')
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: t('accessibility.features.visual.title'),
      description: t('accessibility.features.visual.description')
    },
    {
      icon: <Volume2 className="h-5 w-5" />,
      title: t('accessibility.features.audio.title'),
      description: t('accessibility.features.audio.description')
    },
    {
      icon: <MousePointer className="h-5 w-5" />,
      title: t('accessibility.features.motor.title'),
      description: t('accessibility.features.motor.description')
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-labelledby="accessibility-title"
      aria-describedby="accessibility-description"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle id="accessibility-title" className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t('accessibility.title')}
          </CardTitle>
          <p id="accessibility-description" className="text-sm text-muted-foreground">
            {t('accessibility.description')}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Raccourcis clavier */}
          <section aria-labelledby="keyboard-shortcuts">
            <h3 id="keyboard-shortcuts" className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              {t('accessibility.shortcuts.title')}
            </h3>
            <div className="grid gap-2">
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-2 rounded-lg bg-muted"
                >
                  <kbd className="px-2 py-1 bg-background rounded text-sm font-mono">
                    {shortcut.key}
                  </kbd>
                  <span className="text-sm">{shortcut.action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Fonctionnalités d'accessibilité */}
          <section aria-labelledby="accessibility-features">
            <h3 id="accessibility-features" className="text-lg font-semibold mb-3">
              {t('accessibility.features.title')}
            </h3>
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3 p-3 rounded-lg border">
                  <div className="text-primary">{feature.icon}</div>
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Support responsive */}
          <section aria-labelledby="responsive-support">
            <h3 id="responsive-support" className="text-lg font-semibold mb-3">
              {t('accessibility.responsive.title')}
            </h3>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm">{t('accessibility.responsive.mobile')}</p>
              </div>
              <div className="text-center">
                <Monitor className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm">{t('accessibility.responsive.desktop')}</p>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Button onClick={onClose} autoFocus>
              {t('common.close')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityGuide;