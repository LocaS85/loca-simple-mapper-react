import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  MessageCircle,
  Send,
  Mail,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { shareService, ShareOptions } from '@/services/ShareService';
import { useGeoSearchStore } from '@/store/geoSearchStore';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface ShareButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  variant = 'outline',
  size = 'sm',
  className
}) => {
  const { toast } = useToast();
  const { filters, results, userLocation } = useGeoSearchStore();
  const { preferences } = useUserPreferences();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    includeResults: true,
    includePreferences: false,
    expirationHours: 24 * 7
  });
  const [copied, setCopied] = useState(false);

  const generateShareUrl = async () => {
    setIsGenerating(true);
    try {
      const url = await shareService.generateShareUrl(
        filters,
        results,
        userLocation,
        preferences,
        { ...shareOptions, customMessage }
      );
      
      setShareUrl(url);
      
      // Générer aussi le QR code
      const qrUrl = await shareService.generateQRCode(url);
      setQrCodeUrl(qrUrl);
      
      toast({
        title: "Lien généré",
        description: "Votre recherche peut maintenant être partagée !"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer le lien de partage",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    const success = await shareService.copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans le presse-papiers"
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const openPlatformShare = (platform: string) => {
    const links = shareService.generatePlatformLinks(shareUrl, customMessage);
    if (links[platform]) {
      window.open(links[platform], '_blank', 'width=600,height=400');
    }
  };

  const generateQuickShare = () => {
    const quickUrl = shareService.generateQuickShareUrl(filters, userLocation);
    setShareUrl(quickUrl);
    toast({
      title: "Lien rapide généré",
      description: "Lien simple avec les paramètres de recherche"
    });
  };

  const resetShare = () => {
    setShareUrl('');
    setQrCodeUrl('');
    setCustomMessage('');
    setCopied(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          onClick={() => setIsOpen(true)}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Partager cette recherche
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Options de partage */}
          {!shareUrl && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Message personnalisé (optionnel)
                </label>
                <Textarea
                  placeholder="Découvrez cette recherche intéressante..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="text-sm"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Options</label>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={shareOptions.includeResults ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setShareOptions(prev => ({
                      ...prev,
                      includeResults: !prev.includeResults
                    }))}
                  >
                    Inclure les résultats ({results.length})
                  </Badge>
                  <Badge 
                    variant={shareOptions.includePreferences ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setShareOptions(prev => ({
                      ...prev,
                      includePreferences: !prev.includePreferences
                    }))}
                  >
                    Inclure les préférences
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={generateShareUrl}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? 'Génération...' : 'Générer le lien complet'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={generateQuickShare}
                  className="flex-1"
                >
                  Lien rapide
                </Button>
              </div>
            </div>
          )}

          {/* Lien généré */}
          {shareUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Lien de partage</label>
                <div className="flex gap-2">
                  <Input 
                    value={shareUrl}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="flex-shrink-0"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Copy className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </div>

              {/* QR Code */}
              {qrCodeUrl && (
                <div className="text-center">
                  <label className="text-sm font-medium mb-2 block">QR Code</label>
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="mx-auto border rounded"
                  />
                </div>
              )}

              {/* Plateformes de partage */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Partager sur</label>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPlatformShare('whatsapp')}
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <MessageCircle className="h-4 w-4 mb-1" />
                    <span className="text-xs">WhatsApp</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPlatformShare('telegram')}
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <Send className="h-4 w-4 mb-1" />
                    <span className="text-xs">Telegram</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPlatformShare('email')}
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <Mail className="h-4 w-4 mb-1" />
                    <span className="text-xs">Email</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPlatformShare('twitter')}
                    className="flex flex-col items-center p-2 h-auto"
                  >
                    <Twitter className="h-4 w-4 mb-1" />
                    <span className="text-xs">Twitter</span>
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={resetShare}
                  className="flex-1"
                >
                  Nouveau lien
                </Button>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Fermer
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;