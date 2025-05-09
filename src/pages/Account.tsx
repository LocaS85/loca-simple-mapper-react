
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { User, Heart, Bookmark, CreditCard, Settings } from 'lucide-react';

// Mock user data
const mockUser = {
  name: 'Marie Dupont',
  email: 'marie.dupont@example.com',
  phone: '+33 6 12 34 56 78',
  address: '15 rue de la République, 75001 Paris',
  plan: 'Premium',
  joined: 'Janvier 2023'
};

const Account = () => {
  const isMobile = useIsMobile();
  const [profileData, setProfileData] = useState(mockUser);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile logic would go here
    alert('Profil mis à jour avec succès!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Mon Compte</h1>
      
      <Tabs defaultValue="profile" className={`w-full ${isMobile ? '' : 'max-w-4xl mx-auto'}`}>
        <TabsList className={`grid ${isMobile ? 'grid-cols-3 mb-4' : 'grid-cols-5'} w-full`}>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className={isMobile ? 'hidden' : ''}>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart size={16} />
            <span className={isMobile ? 'hidden' : ''}>Favoris</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark size={16} />
            <span className={isMobile ? 'hidden' : ''}>Enregistrés</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard size={16} />
            <span className={isMobile ? 'hidden' : ''}>Paiement</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            <span className={isMobile ? 'hidden' : ''}>Paramètres</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input 
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input 
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button type="submit">Mettre à jour le profil</Button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Abonnement: {profileData.plan}</h3>
                  <p className="text-sm text-gray-500">Membre depuis {profileData.joined}</p>
                </div>
                <Button variant="outline">
                  <Link to="/payment">Gérer l'abonnement</Link>
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Favorites Tab */}
        <TabsContent value="favorites">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mes lieux favoris</h2>
            <div className="text-center py-12 text-gray-500">
              <Heart size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Vous n'avez pas encore de lieux favoris</p>
              <p className="text-sm mt-2">Explorez la carte et ajoutez des lieux à vos favoris</p>
              <Button className="mt-4">
                <Link to="/">Explorer la carte</Link>
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Saved Tab */}
        <TabsContent value="saved">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recherches enregistrées</h2>
            <div className="text-center py-12 text-gray-500">
              <Bookmark size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Vous n'avez pas encore de recherches enregistrées</p>
              <p className="text-sm mt-2">Enregistrez vos recherches fréquentes pour y accéder rapidement</p>
              <Button className="mt-4">
                <Link to="/">Nouvelle recherche</Link>
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Payment Tab */}
        <TabsContent value="payment">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Méthodes de paiement</h2>
            <div className="text-center py-12 text-gray-500">
              <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Aucune méthode de paiement enregistrée</p>
              <p className="text-sm mt-2">Ajoutez une carte bancaire pour accéder aux fonctionnalités premium</p>
              <Button className="mt-4">Ajouter une méthode de paiement</Button>
            </div>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres du compte</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Notifications</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notifications par email</span>
                  <input type="checkbox" className="toggle" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">Notifications push</span>
                  <input type="checkbox" className="toggle" checked />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Confidentialité</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Partager ma position avec les autres utilisateurs</span>
                  <input type="checkbox" className="toggle" />
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Sécurité</h3>
                <Button variant="outline" size="sm" className="mb-2">Changer le mot de passe</Button>
                <div className="text-sm text-gray-500 mt-2">
                  <p>Dernière connexion: 15/05/2023</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Actions avancées</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">Exporter mes données</Button>
                  <Button variant="destructive" size="sm">Supprimer mon compte</Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Account;
