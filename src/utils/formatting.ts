
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

export const formatDuration = (duration: number): string => {
  if (duration < 60) {
    return `${Math.round(duration)} min`;
  }
  
  const hours = Math.floor(duration / 60);
  const minutes = Math.round(duration % 60);
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h${minutes.toString().padStart(2, '0')}`;
};

export const formatAddress = (address: string, maxLength: number = 50): string => {
  if (address.length <= maxLength) {
    return address;
  }
  
  return address.substring(0, maxLength - 3) + '...';
};

export const formatCategory = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
};
