import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RouteBackButton from '@/components/ui/RouteBackButton';
import Logo from '@/components/ui/Logo';
import ModernTransportManager from '@/components/categories/ModernTransportManager';
import { useSupabaseCategories } from '@/hooks/useSupabaseCategories';
import EnhancedLoadingSpinner from '@/components/shared/EnhancedLoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, User, Bell, Shield } from 'lucide-react';

const Settings = () => {
  const { transportModes, loading, error, updateTransportColor } = useSupabaseCategories();
  const { toast } = useToast();

  const handleUpdateTransportColor = async (transportModeId: string, color: string) => {
    try {
      await updateTransportColor(transportModeId, color);
      toast({
        title: "Couleur mise à jour",
        description: "La couleur du mode de transport a été mise à jour avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la couleur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la couleur du mode de transport.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedLoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button asChild>
              <RouteBackButton route="/categories" showLabel={true} />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <RouteBackButton 
              route="/categories"
              showLabel={true}
              variant="ghost"
            />
            <Logo size="md" variant="primary" showText={true} />
          </div>

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4"
            >
              <SettingsIcon className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mes Réglages
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Personnalisez votre expérience et configurez vos préférences
            </p>
          </div>

          <div className="grid gap-6">
            {/* Transport Modes Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5">
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <Palette className="w-5 h-5 text-white" />
                    </div>
                    Configuration des modes de transport
                  </CardTitle>
                  <CardDescription>
                    Personnalisez les couleurs de vos modes de transport préférés pour une meilleure visualisation sur la carte
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ModernTransportManager
                    transportModes={transportModes}
                    onUpdateColor={handleUpdateTransportColor}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Future Settings Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid md:grid-cols-2 gap-4"
            >
              <Card className="border-dashed border-2 hover:border-solid transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-500">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    Profil utilisateur
                  </CardTitle>
                  <CardDescription>
                    Gérez vos informations personnelles et préférences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" disabled className="w-full">
                    Bientôt disponible
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2 hover:border-solid transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-500">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-gray-400" />
                    </div>
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Configurez vos préférences de notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" disabled className="w-full">
                    Bientôt disponible
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;