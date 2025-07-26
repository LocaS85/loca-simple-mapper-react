import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin, Settings, Palette, Building, Star } from 'lucide-react';
import { UserAddress } from '@/hooks/useSupabaseCategories';
import { motion, AnimatePresence } from 'framer-motion';
import FavoriteAddressButton from './FavoriteAddressButton';

interface CustomAddressCardProps {
  addresses: UserAddress[];
  onAddAddress: (address: Omit<UserAddress, 'id' | 'user_id'>) => Promise<void>;
  onUpdateAddress: (id: string, updates: Partial<UserAddress>) => Promise<void>;
  onDeleteAddress: (id: string) => Promise<void>;
  maxAddresses?: number;
}

const CUSTOM_ROLES = [
  'personnel', 'professionnel', 'loisir', 'sport', 'santé', 'famille', 'ami', 'autre'
];

const CustomAddressCard: React.FC<CustomAddressCardProps> = ({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  maxAddresses = 10
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [categoryConfig, setCategoryConfig] = useState({
    name: 'Autre',
    icon: '📍',
    color: '#6366f1'
  });
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    role: '',
    company_name: '',
    coordinates: [0, 0] as [number, number]
  });

  // Récupérer les adresses personnalisées
  const customAddresses = addresses.filter(addr => addr.custom_category_name);
  
  // Récupérer la configuration de catégorie depuis la première adresse personnalisée
  React.useEffect(() => {
    if (customAddresses.length > 0) {
      const firstCustom = customAddresses[0];
      setCategoryConfig({
        name: firstCustom.custom_category_name || 'Autre',
        icon: firstCustom.custom_category_icon || '📍',
        color: firstCustom.custom_category_color || '#6366f1'
      });
    }
  }, [customAddresses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) return;

    if (editingAddress) {
      await onUpdateAddress(editingAddress.id, {
        name: formData.name,
        address: formData.address,
        coordinates: formData.coordinates,
        role: formData.role || undefined,
        company_name: formData.company_name || undefined
      });
    } else {
      await onAddAddress({
        name: formData.name,
        address: formData.address,
        coordinates: formData.coordinates,
        role: formData.role || undefined,
        company_name: formData.company_name || undefined,
        custom_category_name: categoryConfig.name,
        custom_category_icon: categoryConfig.icon,
        custom_category_color: categoryConfig.color,
        is_primary: false
      });
    }

    setFormData({ name: '', address: '', role: '', company_name: '', coordinates: [0, 0] });
    setShowAddDialog(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      address: address.address,
      role: address.role || '',
      company_name: address.company_name || '',
      coordinates: address.coordinates
    });
    setShowAddDialog(true);
  };

  const handleCategoryUpdate = async () => {
    // Mettre à jour toutes les adresses personnalisées avec la nouvelle configuration
    for (const address of customAddresses) {
      await onUpdateAddress(address.id, {
        custom_category_name: categoryConfig.name,
        custom_category_icon: categoryConfig.icon,
        custom_category_color: categoryConfig.color
      });
    }
    setShowCategoryDialog(false);
  };

  const canAddMore = customAddresses.length < maxAddresses;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
        <CardHeader 
          className="pb-3 relative"
          style={{ backgroundColor: `${categoryConfig.color}10` }}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                style={{ 
                  backgroundColor: categoryConfig.color,
                  background: `linear-gradient(135deg, ${categoryConfig.color}, ${categoryConfig.color}88)`
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xl filter drop-shadow-sm">{categoryConfig.icon}</span>
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{categoryConfig.name}</h3>
                <span className="text-sm text-gray-500">{customAddresses.length} adresses</span>
              </div>
            </div>
            <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Personnaliser la catégorie</DialogTitle>
                  <DialogDescription>
                    Modifiez le nom, l'icône et la couleur de votre catégorie personnalisée
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName">Nom de la catégorie</Label>
                    <Input
                      id="categoryName"
                      value={categoryConfig.name}
                      onChange={(e) => setCategoryConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Loisirs, Sport, Famille élargie..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryIcon">Icône (émoji)</Label>
                    <Input
                      id="categoryIcon"
                      value={categoryConfig.icon}
                      onChange={(e) => setCategoryConfig(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="📍"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryColor">Couleur</Label>
                    <div className="flex gap-2">
                      <Input
                        id="categoryColor"
                        type="color"
                        value={categoryConfig.color}
                        onChange={(e) => setCategoryConfig(prev => ({ ...prev, color: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={categoryConfig.color}
                        onChange={(e) => setCategoryConfig(prev => ({ ...prev, color: e.target.value }))}
                        placeholder="#6366f1"
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCategoryUpdate} className="flex-1">
                      <Palette className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCategoryDialog(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Créez vos propres catégories d'adresses personnalisées
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence>
              {customAddresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors duration-200 group/address"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${categoryConfig.color}20` }}
                      >
                        <MapPin className="h-4 w-4" style={{ color: categoryConfig.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{address.name}</span>
                          {address.role && (
                            <span 
                              className="text-xs px-2 py-1 rounded-full text-white"
                              style={{ backgroundColor: categoryConfig.color }}
                            >
                              {address.role}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                        {address.company_name && (
                          <p className="text-sm font-medium mt-1" style={{ color: categoryConfig.color }}>
                            <Building className="h-3 w-3 inline mr-1" />
                            {address.company_name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover/address:opacity-100 transition-opacity duration-200">
                    <FavoriteAddressButton 
                      address={address} 
                      categoryName={categoryConfig.name} 
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteAddress(address.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {canAddMore && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-dashed hover:border-solid transition-all duration-300"
                      style={{ borderColor: `${categoryConfig.color}40`, color: categoryConfig.color }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une adresse à {categoryConfig.name}
                    </Button>
                  </motion.div>
                </DialogTrigger>
                
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingAddress ? 'Modifier' : 'Ajouter'} - {categoryConfig.name}
                    </DialogTitle>
                    <DialogDescription>
                      Ajoutez une nouvelle adresse à votre catégorie personnalisée
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom de l'adresse</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Salle de sport, Bibliothèque..."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Adresse complète</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="123 Rue de la Paix, 75001 Paris"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Type/Rôle</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CUSTOM_ROLES.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="company">Entreprise/Organisation (optionnel)</Label>
                      <Input
                        id="company"
                        value={formData.company_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Nom de l'entreprise ou organisation"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        {editingAddress ? 'Modifier' : 'Ajouter'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowAddDialog(false);
                          setEditingAddress(null);
                          setFormData({ name: '', address: '', role: '', company_name: '', coordinates: [0, 0] });
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {!canAddMore && (
              <p className="text-sm text-gray-500 text-center py-2">
                Maximum {maxAddresses} adresses atteint
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomAddressCard;