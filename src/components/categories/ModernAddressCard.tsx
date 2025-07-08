import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin, Building, Users, GraduationCap, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserAddress } from '@/hooks/useSupabaseCategories';

interface ModernAddressCardProps {
  category: {
    id: string;
    name: string;
    description?: string;
    icon: string;
    color: string;
    category_type: 'special';
  };
  addresses: UserAddress[];
  onAddAddress: (address: Omit<UserAddress, 'id' | 'user_id'>) => Promise<void>;
  onUpdateAddress: (id: string, updates: Partial<UserAddress>) => Promise<void>;
  onDeleteAddress: (id: string) => Promise<void>;
  maxAddresses?: number;
}

const FAMILY_ROLES = [
  'père', 'mère', 'frère', 'sœur', 'fils', 'fille', 
  'grand-père', 'grand-mère', 'oncle', 'tante', 
  'cousin', 'cousine', 'ami', 'amie', 'collègue', 'autre'
];

const WORK_ROLES = [
  'principal', 'secondaire', 'temps partiel', 'freelance', 'stage', 'autre'
];

const SCHOOL_ROLES = [
  'primaire', 'collège', 'lycée', 'université', 'formation', 'autre'
];

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName) {
    case 'Famille': return Users;
    case 'Travail': return Building;
    case 'École': return GraduationCap;
    case 'Adresse principale': return Home;
    default: return MapPin;
  }
};

const ModernAddressCard: React.FC<ModernAddressCardProps> = ({
  category,
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  maxAddresses = 10
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    role: '',
    company_name: '',
    coordinates: [0, 0] as [number, number],
    is_primary: false
  });

  const categoryAddresses = addresses.filter(addr => {
    switch (category.name) {
      case 'Famille': return addr.category_type === 'family';
      case 'Travail': return addr.category_type === 'work';
      case 'École': return addr.category_type === 'school';
      case 'Adresse principale': return addr.category_type === 'main';
      default: return false;
    }
  });

  const getRoleOptions = () => {
    switch (category.name) {
      case 'Famille': return FAMILY_ROLES;
      case 'Travail': return WORK_ROLES;
      case 'École': return SCHOOL_ROLES;
      default: return [];
    }
  };

  const getCategoryType = (): 'main' | 'family' | 'work' | 'school' => {
    switch (category.name) {
      case 'Famille': return 'family';
      case 'Travail': return 'work';
      case 'École': return 'school';
      case 'Adresse principale': return 'main';
      default: return 'main';
    }
  };

  const IconComponent = getCategoryIcon(category.name);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) return;

    if (category.name === 'Adresse principale' && categoryAddresses.length > 0) {
      await onUpdateAddress(categoryAddresses[0].id, {
        name: formData.name,
        address: formData.address,
        coordinates: formData.coordinates,
        is_primary: true
      });
    } else {
      await onAddAddress({
        category_type: getCategoryType(),
        name: formData.name,
        address: formData.address,
        coordinates: formData.coordinates,
        role: formData.role || undefined,
        company_name: formData.company_name || undefined,
        is_primary: category.name === 'Adresse principale'
      });
    }

    setFormData({
      name: '',
      address: '',
      role: '',
      company_name: '',
      coordinates: [0, 0],
      is_primary: false
    });
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
      coordinates: address.coordinates,
      is_primary: address.is_primary
    });
    setShowAddDialog(true);
  };

  const handleUpdate = async () => {
    if (!editingAddress) return;
    
    await onUpdateAddress(editingAddress.id, {
      name: formData.name,
      address: formData.address,
      coordinates: formData.coordinates,
      role: formData.role || undefined,
      company_name: formData.company_name || undefined
    });

    setEditingAddress(null);
    setShowAddDialog(false);
    setFormData({
      name: '',
      address: '',
      role: '',
      company_name: '',
      coordinates: [0, 0],
      is_primary: false
    });
  };

  const canAddMore = category.name === 'Adresse principale' 
    ? categoryAddresses.length === 0 
    : categoryAddresses.length < maxAddresses;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className="w-full overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:border-primary/50 relative group"
        style={{ borderColor: isHovered ? category.color : undefined }}
      >
        <CardHeader 
          className="pb-4 transition-colors duration-300"
          style={{ backgroundColor: isHovered ? `${category.color}10` : undefined }}
        >
          <CardTitle className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transform transition-transform duration-300 hover:scale-110"
              style={{ 
                backgroundColor: category.color,
                background: `linear-gradient(135deg, ${category.color}, ${category.color}88)`
              }}
            >
              <IconComponent className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              <span className="text-sm text-gray-500">
                {categoryAddresses.length} 
                {category.name === 'Adresse principale' 
                  ? ' adresse configurée' 
                  : ` adresse${categoryAddresses.length > 1 ? 's' : ''} enregistrée${categoryAddresses.length > 1 ? 's' : ''}`
                }
              </span>
            </div>
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {category.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {categoryAddresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
              className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors duration-200 group/address"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <MapPin className="h-4 w-4" style={{ color: category.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{address.name}</span>
                      {address.role && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          {address.role}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                    {address.company_name && (
                      <p className="text-sm font-medium mt-1" style={{ color: category.color }}>
                        {address.company_name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover/address:opacity-100 transition-opacity duration-200">
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

          {canAddMore && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-dashed border-2 hover:border-solid transition-all duration-200 h-12"
                  style={{ borderColor: category.color, color: category.color }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {category.name === 'Adresse principale' 
                    ? 'Définir adresse principale' 
                    : `Ajouter ${category.name.toLowerCase()}`
                  }
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    {editingAddress ? 'Modifier' : 'Ajouter'} - {category.name}
                  </DialogTitle>
                  <DialogDescription>
                    {category.description}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={editingAddress ? handleUpdate : handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={category.name === 'Famille' ? 'Papa, Maman...' : 
                                  category.name === 'Travail' ? 'Job principal, Job 2...' :
                                  category.name === 'École' ? 'École primaire, Université...' :
                                  'Mon domicile'}
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

                  {getRoleOptions().length > 0 && (
                    <div>
                      <Label htmlFor="role">Rôle</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          {getRoleOptions().map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {category.name === 'Travail' && (
                    <div>
                      <Label htmlFor="company">Nom de l'entreprise</Label>
                      <Input
                        id="company"
                        value={formData.company_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                        placeholder="Nom de l'entreprise"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      className="flex-1"
                      style={{ backgroundColor: category.color }}
                    >
                      {editingAddress ? 'Modifier' : 'Ajouter'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddDialog(false);
                        setEditingAddress(null);
                        setFormData({
                          name: '',
                          address: '',
                          role: '',
                          company_name: '',
                          coordinates: [0, 0],
                          is_primary: false
                        });
                      }}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {!canAddMore && category.name !== 'Adresse principale' && (
            <div className="text-center py-4 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-sm text-gray-500">
                Maximum {maxAddresses} adresses atteint
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModernAddressCard;