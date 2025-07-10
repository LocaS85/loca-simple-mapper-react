
import React from 'react';
import { DailyAddressItem } from '@/types/unified';

interface DailyAddressSectionProps {
  subcategoryId: string;
  addresses: DailyAddressItem[];
  onEditAddress: (address: DailyAddressItem) => void;
  onDeleteAddress: (addressId: string) => void;
  onAddNewAddress: () => void;
}

const DailyAddressSection: React.FC<DailyAddressSectionProps> = ({
  addresses,
  onEditAddress,
  onDeleteAddress,
  onAddNewAddress
}) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Adresses enregistrées</h3>
        {addresses.length < 10 && (
          <button
            onClick={onAddNewAddress}
            className="text-blue-500 hover:text-blue-700 font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Ajouter
          </button>
        )}
      </div>
      
      {addresses.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Aucune adresse enregistrée dans cette catégorie</p>
      ) : (
        <div className="space-y-3">
          {addresses.map(address => (
            <div key={address.id} className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
              <div>
                <h4 className="font-medium">{address.name}</h4>
                <p className="text-sm text-gray-600 truncate max-w-[200px] md:max-w-[400px]">
                  {address.address}
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => onEditAddress(address)}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l9.38-9.379-2.83-2.828z" />
                  </svg>
                </button>
                <button 
                  onClick={() => onDeleteAddress(address.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 10-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyAddressSection;
