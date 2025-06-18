
export type TransportMode = 'walking' | 'driving' | 'cycling' | 'transit';

export const transportModes: { value: TransportMode; label: string; icon: string }[] = [
  { value: 'walking', label: 'À pied', icon: '🚶' },
  { value: 'driving', label: 'En voiture', icon: '🚗' },
  { value: 'cycling', label: 'À vélo', icon: '🚴' },
  { value: 'transit', label: 'Transport public', icon: '🚌' },
];

export const getTransportModeInfo = (mode: TransportMode) => {
  return transportModes.find(m => m.value === mode) || transportModes[0];
};
