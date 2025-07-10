/**
 * Utilitaires pour la redirection vers des applications de navigation externes
 */

export interface NavigationDestination {
  lat: number;
  lng: number;
  name?: string;
  address?: string;
}

export interface NavigationOrigin {
  lat: number;
  lng: number;
}

/**
 * Détecte le type d'appareil et navigateur
 */
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  return {
    isMobile: /iPhone|Android/i.test(navigator.userAgent),
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    isSafari: /^((?!chrome|android).)*safari/i.test(userAgent),
    isChrome: /chrome/.test(userAgent),
    isFirefox: /firefox/.test(userAgent)
  };
};

/**
 * Génère l'URL pour Google Maps
 */
export const generateGoogleMapsURL = (
  destination: NavigationDestination,
  origin?: NavigationOrigin,
  mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
): string => {
  let url = 'https://www.google.com/maps/dir/?api=1';
  
  // Point de départ
  if (origin) {
    url += `&origin=${origin.lat},${origin.lng}`;
  }
  
  // Destination
  url += `&destination=${destination.lat},${destination.lng}`;
  
  // Nom du lieu si disponible
  if (destination.name) {
    url += `&destination_place_id=${encodeURIComponent(destination.name)}`;
  }
  
  // Mode de transport
  const googleModes = {
    driving: 'driving',
    walking: 'walking',
    bicycling: 'bicycling',
    transit: 'transit'
  };
  url += `&travelmode=${googleModes[mode]}`;
  
  return url;
};

/**
 * Génère l'URL pour Waze
 */
export const generateWazeURL = (
  destination: NavigationDestination,
  navigate: boolean = true
): string => {
  let url = `https://waze.com/ul?ll=${destination.lat},${destination.lng}`;
  
  if (navigate) {
    url += '&navigate=yes';
  }
  
  if (destination.name) {
    url += `&q=${encodeURIComponent(destination.name)}`;
  }
  
  return url;
};

/**
 * Génère l'URL pour Apple Maps (Plans)
 */
export const generateAppleMapsURL = (
  destination: NavigationDestination,
  origin?: NavigationOrigin,
  mode: 'd' | 'w' | 'r' = 'd' // d=driving, w=walking, r=transit
): string => {
  let url = 'https://maps.apple.com/';
  
  if (origin) {
    url += `?saddr=${origin.lat},${origin.lng}&daddr=${destination.lat},${destination.lng}`;
  } else {
    url += `?daddr=${destination.lat},${destination.lng}`;
  }
  
  // Mode de transport
  url += `&dirflg=${mode}`;
  
  // Nom du lieu si disponible
  if (destination.name) {
    url += `&q=${encodeURIComponent(destination.name)}`;
  }
  
  return url;
};

/**
 * Génère l'URL pour Citymapper (populaire dans certaines villes)
 */
export const generateCitymapperURL = (
  destination: NavigationDestination,
  origin?: NavigationOrigin
): string => {
  let url = `https://citymapper.com/directions?endcoord=${destination.lat},${destination.lng}`;
  
  if (origin) {
    url += `&startcoord=${origin.lat},${origin.lng}`;
  }
  
  if (destination.name) {
    url += `&endname=${encodeURIComponent(destination.name)}`;
  }
  
  return url;
};

/**
 * Ouvre Google Maps avec navigation
 */
export const openGoogleMaps = (
  destination: NavigationDestination,
  origin?: NavigationOrigin,
  mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
): void => {
  const url = generateGoogleMapsURL(destination, origin, mode);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Ouvre Waze avec navigation
 */
export const openWaze = (destination: NavigationDestination): void => {
  const url = generateWazeURL(destination, true);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Ouvre Apple Maps avec navigation
 */
export const openAppleMaps = (
  destination: NavigationDestination,
  origin?: NavigationOrigin,
  mode: 'd' | 'w' | 'r' = 'd'
): void => {
  const url = generateAppleMapsURL(destination, origin, mode);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Ouvre l'application de navigation la plus appropriée selon l'appareil
 */
export const openBestNavigationApp = (
  destination: NavigationDestination,
  origin?: NavigationOrigin,
  mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
): void => {
  const device = getDeviceInfo();
  
  if (device.isIOS) {
    // Sur iOS, proposer Apple Maps en premier
    openAppleMaps(destination, origin, mode === 'driving' ? 'd' : mode === 'walking' ? 'w' : 'r');
  } else if (device.isAndroid) {
    // Sur Android, Google Maps est généralement préféré
    openGoogleMaps(destination, origin, mode);
  } else {
    // Sur desktop, Google Maps web
    openGoogleMaps(destination, origin, mode);
  }
};

/**
 * Obtient la liste des applications disponibles selon l'appareil
 */
export const getAvailableNavigationApps = () => {
  const device = getDeviceInfo();
  const apps = [];
  
  // Google Maps - toujours disponible
  apps.push({
    name: 'Google Maps',
    id: 'google-maps',
    icon: '🗺️',
    primary: !device.isIOS
  });
  
  // Waze - disponible sur mobile
  if (device.isMobile) {
    apps.push({
      name: 'Waze',
      id: 'waze',
      icon: '🚗',
      primary: false
    });
  }
  
  // Apple Maps - sur iOS uniquement
  if (device.isIOS) {
    apps.push({
      name: 'Plans',
      id: 'apple-maps',
      icon: '🧭',
      primary: true
    });
  }
  
  // Citymapper - dans certaines grandes villes
  if (device.isMobile) {
    apps.push({
      name: 'Citymapper',
      id: 'citymapper',
      icon: '🚇',
      primary: false
    });
  }
  
  return apps;
};

/**
 * Lance la navigation selon l'ID de l'application
 */
export const launchNavigation = (
  appId: string,
  destination: NavigationDestination,
  origin?: NavigationOrigin,
  mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
): void => {
  switch (appId) {
    case 'google-maps':
      openGoogleMaps(destination, origin, mode);
      break;
    case 'waze':
      openWaze(destination);
      break;
    case 'apple-maps':
      openAppleMaps(destination, origin, mode === 'driving' ? 'd' : mode === 'walking' ? 'w' : 'r');
      break;
    case 'citymapper':
      const url = generateCitymapperURL(destination, origin);
      window.open(url, '_blank', 'noopener,noreferrer');
      break;
    default:
      console.warn(`Application de navigation inconnue: ${appId}`);
      openGoogleMaps(destination, origin, mode);
  }
};

/**
 * Copie les coordonnées dans le presse-papiers
 */
export const copyCoordinates = async (destination: NavigationDestination): Promise<boolean> => {
  try {
    const coordinates = `${destination.lat}, ${destination.lng}`;
    await navigator.clipboard.writeText(coordinates);
    return true;
  } catch (error) {
    console.error('Erreur copie coordonnées:', error);
    return false;
  }
};

/**
 * Partage la localisation (si supporté)
 */
export const shareLocation = async (destination: NavigationDestination): Promise<boolean> => {
  if (!navigator.share) {
    return false;
  }
  
  try {
    const url = generateGoogleMapsURL(destination);
    await navigator.share({
      title: destination.name || 'Lieu partagé',
      text: destination.address || `${destination.lat}, ${destination.lng}`,
      url: url
    });
    return true;
  } catch (error) {
    console.error('Erreur partage:', error);
    return false;
  }
};