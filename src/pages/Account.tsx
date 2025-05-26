
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import RouteBackButton from '@/components/ui/RouteBackButton';
import { 
  User, 
  Heart, 
  History, 
  Trash2, 
  Share, 
  MapPin, 
  Calendar, 
  Crown, 
  Settings,
  Download,
  Eye,
  Edit,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

// Mock data
const mockUser = {
  name: 'Jean Dupont',
  email: 'jean.dupont@email.com',
  subscription: 'Premium',
  subscriptionEnd: '15 mai 2025',
  memberSince: 'Janvier 2024'
};

const mockFavorites = [
  {
    id: 'fav1',
    name: 'Tour Eiffel',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
    category: 'Monument',
    date: '12 avril 2025',
    shared: false
  },
  {
    id: 'fav2',
    name: 'Café de la Paix',
    address: '5 Place de l\'Opéra, 75009 Paris',
    category: 'Restaurant',
    date: '10 avril 2025',
    shared: true
  },
  {
    id: 'fav3',
    name: 'Musée du Louvre',
    address: 'Rue de Rivoli, 75001 Paris',
    category: 'Musée',
    date: '08 avril 2025',
    shared: false
  }
];

const mockHistory = [
  {
    id: 'hist1',
    query: 'Restaurants près de République',
    date: '14 avril 2025',
    results: 23,
    category: 'Restaurant'
  },
  {
    id: 'hist2',
    query: 'Pharmacies ouvertes dimanche',
    date: '13 avril 2025',
    results: 8,
    category: 'Santé'
  },
  {
    id: 'hist3',
    query: 'Parcs et jardins 16ème',
    date: '12 avril 2025',
    results: 12,
    category: 'Loisirs'
  }
];

const Account = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'history' | 'settings'>('overview');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (items: any[], type: 'favorites' | 'history') => {
    const itemIds = items.map(item => item.id);
    setSelectedItems(prev => {
      const hasAll = itemIds.every(id => prev.includes(id));
      if (hasAll) {
        return prev.filter(id => !itemIds.includes(id));
      } else {
        return [...prev, ...itemIds.filter(id => !prev.includes(id))];
      }
    });
  };

  const handleDeleteSelected = () => {
    console.log('Deleting items:', selectedItems);
    setSelectedItems([]);
    setShowDeleteAlert(false);
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/?place=${id}`;
    navigator.clipboard.writeText(url);
    console.log('Shared:', url);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleDeleteAccount = () => {
    console.log('Delete account requested');
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: User },
    { id: 'favorites', label: 'Favoris', icon: Heart },
    { id: 'history', label: 'Historique', icon: History },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <RouteBackButton route="/" />
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Mon Compte
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Gérez vos préférences et votre contenu LocaSimple
          </p>
        </div>

        <div className={`${isMobile ? 'flex flex-col space-y-6' : 'grid grid-cols-4 gap-8'}`}>
          {/* Sidebar Navigation */}
          <div className={`${isMobile ? '' : 'col-span-1'}`}>
            <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {mockUser.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{mockUser.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-1">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span>{mockUser.subscription}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
                          activeTab === tab.id
                            ? 'bg-blue-500 text-white shadow-lg scale-[1.02]'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className={`${isMobile ? '' : 'col-span-3'}`}>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Profile Overview */}
                <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm transform hover:scale-[1.01] transition-all duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-blue-600" />
                      <span>Profil utilisateur</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Nom complet</p>
                        <p className="font-medium">{mockUser.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium">{mockUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Abonnement</p>
                        <div className="flex items-center space-x-2">
                          <Crown className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{mockUser.subscription}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Membre depuis</p>
                        <p className="font-medium">{mockUser.memberSince}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Edit className="h-4 w-4" />
                        <span>Modifier le profil</span>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to="/premium" className="flex items-center space-x-2">
                          <Crown className="h-4 w-4" />
                          <span>Gérer l'abonnement</span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-[1.05] transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">Favoris</p>
                          <p className="text-2xl font-bold">{mockFavorites.length}</p>
                        </div>
                        <Heart className="h-8 w-8 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-teal-500 to-teal-600 text-white transform hover:scale-[1.05] transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-teal-100">Recherches</p>
                          <p className="text-2xl font-bold">{mockHistory.length}</p>
                        </div>
                        <History className="h-8 w-8 text-teal-200" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-[1.05] transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">Partages</p>
                          <p className="text-2xl font-bold">{mockFavorites.filter(f => f.shared).length}</p>
                        </div>
                        <Share className="h-8 w-8 text-purple-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>Mes Favoris ({mockFavorites.length})</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectAll(mockFavorites, 'favorites')}
                        className="hover:scale-[1.05] transition-transform"
                      >
                        {mockFavorites.every(f => selectedItems.includes(f.id)) ? 'Désélectionner tout' : 'Sélectionner tout'}
                      </Button>
                      {selectedItems.length > 0 && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setShowDeleteAlert(true)}
                          className="hover:scale-[1.05] transition-transform"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer ({selectedItems.length})
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleExport}
                        className="hover:scale-[1.05] transition-transform"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Exporter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockFavorites.map((favorite) => (
                      <div 
                        key={favorite.id} 
                        className={`p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${
                          selectedItems.includes(favorite.id)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(favorite.id)}
                            onChange={() => handleSelectItem(favorite.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">{favorite.name}</h3>
                              <div className="flex items-center space-x-2">
                                {favorite.shared && (
                                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                                    <Share className="h-3 w-3" />
                                    <span>Partagé</span>
                                  </div>
                                )}
                                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                                  {favorite.category}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{favorite.address}</p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                              Ajouté le {favorite.date}
                            </p>
                            <div className="flex items-center space-x-2 mt-3">
                              <Button variant="outline" size="sm" className="hover:scale-[1.05] transition-transform">
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleShare(favorite.id)}
                                className="hover:scale-[1.05] transition-transform"
                              >
                                <Share className="h-4 w-4 mr-1" />
                                Partager
                              </Button>
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/?place=${favorite.id}`} className="hover:scale-[1.05] transition-transform flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  Carte
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'history' && (
              <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <History className="h-5 w-5 text-purple-500" />
                      <span>Historique des recherches ({mockHistory.length})</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSelectAll(mockHistory, 'history')}
                        className="hover:scale-[1.05] transition-transform"
                      >
                        {mockHistory.every(h => selectedItems.includes(h.id)) ? 'Désélectionner tout' : 'Sélectionner tout'}
                      </Button>
                      {selectedItems.length > 0 && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => setShowDeleteAlert(true)}
                          className="hover:scale-[1.05] transition-transform"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer ({selectedItems.length})
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockHistory.map((search) => (
                      <div 
                        key={search.id} 
                        className={`p-4 rounded-lg border-2 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg ${
                          selectedItems.includes(search.id)
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-[1.02]'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(search.id)}
                            onChange={() => handleSelectItem(search.id)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">{search.query}</h3>
                              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                                {search.category}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>{search.date}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{search.results} résultats</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-3">
                              <Button variant="outline" size="sm" className="hover:scale-[1.05] transition-transform">
                                <History className="h-4 w-4 mr-1" />
                                Relancer
                              </Button>
                              <Button variant="outline" size="sm" className="hover:scale-[1.05] transition-transform">
                                <Share className="h-4 w-4 mr-1" />
                                Partager
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Account Settings */}
                <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <span>Paramètres du compte</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start hover:scale-[1.02] transition-transform">
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier les informations personnelles
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:scale-[1.02] transition-transform">
                      <Settings className="h-4 w-4 mr-2" />
                      Préférences de notification
                    </Button>
                    <Button variant="outline" className="w-full justify-start hover:scale-[1.02] transition-transform">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter mes données
                    </Button>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="shadow-xl border-0 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-5 w-5" />
                      <span>Zone de danger</span>
                    </CardTitle>
                    <CardDescription className="text-red-600 dark:text-red-400">
                      Actions irréversibles - procédez avec prudence
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      className="hover:scale-[1.02] transition-transform"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer définitivement mon compte
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Delete Confirmation Alert */}
            {showDeleteAlert && (
              <Alert className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-md border-red-200 bg-white dark:bg-gray-800 shadow-2xl">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="mt-2">
                  <p className="font-medium text-red-600 mb-3">
                    Êtes-vous sûr de vouloir supprimer {selectedItems.length} élément(s) ?
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Cette action est irréversible.
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleDeleteSelected}
                      className="hover:scale-[1.05] transition-transform"
                    >
                      Supprimer
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDeleteAlert(false)}
                      className="hover:scale-[1.05] transition-transform"
                    >
                      Annuler
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
