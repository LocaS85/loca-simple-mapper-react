import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { UserAddress } from '@/hooks/useSupabaseCategories';

interface AddressManagementCardProps {
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
  'cousin', 'cousine', 'ami', 'amie', 'collègue'
];

const WORK_ROLES = [
  'principal', 'secondaire', 'temps partiel', 'freelance', 'stage'
];

const SCHOOL_ROLES = [
  'primaire', 'collège', 'lycée', 'université', 'formation'
];

const AddressManagementCard: React.FC<AddressManagementCardProps> = ({
  category,
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  maxAddresses = 10
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) return;

    // Pour l'adresse principale, limiter à 1 seule
    if (category.name === 'Adresse principale' && categoryAddresses.length > 0) {
      // Mettre à jour l'adresse existante
      await onUpdateAddress(categoryAddresses[0].id, {
        name: formData.name,
        address: formData.address,
        coordinates: formData.coordinates,
        is_primary: true
      });
    } else {
      // Ajouter une nouvelle adresse
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <span>{category.name}</span>
        </CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {categoryAddresses.map((address) => (
            <div key={address.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">{address.name}</span>
                  {address.role && (
                    <span className="text-sm text-gray-500">({address.role})</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                {address.company_name && (
                  <p className="text-sm text-blue-600 mt-1">{address.company_name}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(address)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteAddress(address.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {canAddMore && (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {category.name === 'Adresse principale' ? 'Définir adresse principale' : `Ajouter ${category.name.toLowerCase()}`}
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
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
                        setFormData({
                          name: '',
                          address: '',
                          role: '',
                          company_name: '',
                          coordinates: [0, 0],
                          is_primary: false
                        });
                      }}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {!canAddMore && category.name !== 'Adresse principale' && (
            <p className="text-sm text-gray-500 text-center py-2">
              Maximum {maxAddresses} adresses atteint
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressManagementCard;