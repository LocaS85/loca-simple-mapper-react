
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import DailyAddressForm from '@/components/DailyAddressForm';
import { DailyAddressItem } from '@/types/unified';

interface AddressFormDialogProps {
  showAddressForm: boolean;
  setShowAddressForm: (show: boolean) => void;
  editingAddress: DailyAddressItem | null;
  setEditingAddress: (address: DailyAddressItem | null) => void;
  onSaveAddress: (addressData: Partial<DailyAddressItem>) => void;
}

const AddressFormDialog: React.FC<AddressFormDialogProps> = ({
  showAddressForm,
  setShowAddressForm,
  editingAddress,
  setEditingAddress,
  onSaveAddress
}) => {
  return (
    <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une nouvelle adresse'}
          </DialogTitle>
        </DialogHeader>
        <DailyAddressForm 
          onSave={onSaveAddress}
          onCancel={() => {
            setShowAddressForm(false);
            setEditingAddress(null);
          }}
          initialData={editingAddress || {}}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormDialog;
