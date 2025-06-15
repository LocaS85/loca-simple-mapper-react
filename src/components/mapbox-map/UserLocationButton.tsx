
import React from 'react';
import { LocateFixed } from 'lucide-react';

interface UserLocationButtonProps {
  onClick: () => void;
}

const UserLocationButton: React.FC<UserLocationButtonProps> = ({ onClick }) => (
  <button
    className="absolute bottom-4 right-4 z-10 p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    onClick={onClick}
    aria-label="Centrer la carte sur ma position"
    title="Centrer sur ma position"
    type="button"
  >
    <LocateFixed className="w-5 h-5 text-gray-700" />
  </button>
);

export default UserLocationButton;
