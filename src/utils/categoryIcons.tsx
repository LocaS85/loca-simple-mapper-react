import React from 'react';
import { 
  Utensils, Store, Coffee, ShoppingBag, GraduationCap, Building, Car, Train, Plane,
  Pizza, Beef, Sandwich, Wine, Cookie, Apple, Fish, Salad, 
  Shirt, Gem, Watch, Smartphone, Laptop, Book, Gamepad2,
  Fuel, Hospital, Cross, Mail, Phone, Wrench, Scissors,
  Dumbbell, MapPin, Trees, Mountain, Waves, Sun, Home, Heart,
  Music, Camera, Palette, Briefcase, UserCheck, Baby, PawPrint
} from 'lucide-react';

// Mapping des icônes pour les catégories principales
export const getCategoryIcon = (name: string, fallbackIcon?: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    // Alimentation et Boissons
    'Alimentation et Boissons': <Utensils className="h-5 w-5" />,
    'Restaurants': <Utensils className="h-5 w-5" />,
    'Cafés': <Coffee className="h-5 w-5" />,
    'Bars': <Wine className="h-5 w-5" />,
    'Fast Food': <Sandwich className="h-5 w-5" />,
    
    // Shopping et Commerce
    'Achats': <ShoppingBag className="h-5 w-5" />,
    'Shopping': <ShoppingBag className="h-5 w-5" />,
    'Commerces': <Store className="h-5 w-5" />,
    'Mode': <Shirt className="h-5 w-5" />,
    'Bijouterie': <Gem className="h-5 w-5" />,
    'Électronique': <Smartphone className="h-5 w-5" />,
    
    // Éducation et Culture
    'Éducation': <GraduationCap className="h-5 w-5" />,
    'École': <GraduationCap className="h-5 w-5" />,
    'Bibliothèque': <Book className="h-5 w-5" />,
    'Musée': <Palette className="h-5 w-5" />,
    'Cinéma': <Camera className="h-5 w-5" />,
    
    // Transport
    'Transport': <Car className="h-5 w-5" />,
    'Voiture': <Car className="h-5 w-5" />,
    'Train': <Train className="h-5 w-5" />,
    'Aéroport': <Plane className="h-5 w-5" />,
    'Aérodrome': <Plane className="h-5 w-5" />,
    
    // Services
    'Services': <Building className="h-5 w-5" />,
    'Banque': <Building className="h-5 w-5" />,
    'Poste': <Mail className="h-5 w-5" />,
    'Réparation': <Wrench className="h-5 w-5" />,
    
    // Santé
    'Santé': <Cross className="h-5 w-5" />,
    'Hôpital': <Hospital className="h-5 w-5" />,
    'Pharmacie': <Cross className="h-5 w-5" />,
    
    // Sport et Loisirs
    'Sport': <Dumbbell className="h-5 w-5" />,
    'Fitness': <Dumbbell className="h-5 w-5" />,
    'Loisirs': <Gamepad2 className="h-5 w-5" />,
    'Parc': <Trees className="h-5 w-5" />,
    
    // Famille et Personnel
    'Famille': <Heart className="h-5 w-5" />,
    'Travail': <Briefcase className="h-5 w-5" />,
    'Adresse principale': <Home className="h-5 w-5" />,
    'Autre': <MapPin className="h-5 w-5" />
  };

  // Recherche par nom exact
  if (iconMap[name]) return iconMap[name];

  // Recherche par mots-clés
  const lowerName = name.toLowerCase();
  
  // Alimentation
  if (lowerName.includes('restaurant') || lowerName.includes('manger')) return <Utensils className="h-5 w-5" />;
  if (lowerName.includes('café') || lowerName.includes('coffee')) return <Coffee className="h-5 w-5" />;
  if (lowerName.includes('pizza')) return <Pizza className="h-5 w-5" />;
  if (lowerName.includes('bar') || lowerName.includes('boisson')) return <Wine className="h-5 w-5" />;
  
  // Shopping
  if (lowerName.includes('shop') || lowerName.includes('magasin') || lowerName.includes('boutique')) return <Store className="h-5 w-5" />;
  if (lowerName.includes('vêtement') || lowerName.includes('mode')) return <Shirt className="h-5 w-5" />;
  
  // Transport
  if (lowerName.includes('voiture') || lowerName.includes('auto') || lowerName.includes('parking')) return <Car className="h-5 w-5" />;
  if (lowerName.includes('train') || lowerName.includes('gare')) return <Train className="h-5 w-5" />;
  if (lowerName.includes('avion') || lowerName.includes('aéro')) return <Plane className="h-5 w-5" />;
  
  // Services
  if (lowerName.includes('banque') || lowerName.includes('bank')) return <Building className="h-5 w-5" />;
  if (lowerName.includes('hôpital') || lowerName.includes('médical')) return <Hospital className="h-5 w-5" />;
  if (lowerName.includes('école') || lowerName.includes('university')) return <GraduationCap className="h-5 w-5" />;
  
  // Défaut
  return fallbackIcon ? <span className="text-sm">{fallbackIcon}</span> : <MapPin className="h-5 w-5" />;
};

// Mapping des icônes pour les sous-catégories
export const getSubcategoryIcon = (name: string, parentCategory?: string, fallbackIcon?: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    // Restaurants spécifiques
    'Restaurants Gastronomiques': <Utensils className="h-4 w-4" />,
    'Restaurants Rapides': <Sandwich className="h-4 w-4" />,
    'Restaurants Végétariens': <Salad className="h-4 w-4" />,
    'Restaurants Sushi': <Fish className="h-4 w-4" />,
    'Pizzerias': <Pizza className="h-4 w-4" />,
    'Cuisine du Monde': <Utensils className="h-4 w-4" />,
    'Boulangeries': <Cookie className="h-4 w-4" />,
    
    // Shopping spécifique
    'Magasins de Vêtements': <Shirt className="h-4 w-4" />,
    'Bijouteries': <Gem className="h-4 w-4" />,
    'Magasins d\'Électronique': <Smartphone className="h-4 w-4" />,
    'Librairies': <Book className="h-4 w-4" />,
    'Magasins de Sport': <Dumbbell className="h-4 w-4" />,
    'Centres Commerciaux': <Building className="h-4 w-4" />,
    
    // Services spécifiques
    'Banques': <Building className="h-4 w-4" />,
    'Bureaux de Poste': <Mail className="h-4 w-4" />,
    'Salons de Coiffure': <Scissors className="h-4 w-4" />,
    'Garages': <Wrench className="h-4 w-4" />,
    'Stations Service': <Fuel className="h-4 w-4" />,
    
    // Santé spécifique
    'Hôpitaux': <Hospital className="h-4 w-4" />,
    'Pharmacies': <Cross className="h-4 w-4" />,
    'Cabinets Médicaux': <UserCheck className="h-4 w-4" />,
    'Dentistes': <UserCheck className="h-4 w-4" />,
    
    // Éducation spécifique
    'Écoles Primaires': <GraduationCap className="h-4 w-4" />,
    'Collèges': <GraduationCap className="h-4 w-4" />,
    'Lycées': <GraduationCap className="h-4 w-4" />,
    'Universités': <GraduationCap className="h-4 w-4" />,
    'Crèches': <Baby className="h-4 w-4" />,
    
    // Loisirs spécifique
    'Cinémas': <Camera className="h-4 w-4" />,
    'Musées': <Palette className="h-4 w-4" />,
    'Parcs': <Trees className="h-4 w-4" />,
    'Plages': <Waves className="h-4 w-4" />,
    'Salles de Sport': <Dumbbell className="h-4 w-4" />,
    'Vétérinaires': <PawPrint className="h-4 w-4" />
  };

  // Recherche par nom exact
  if (iconMap[name]) return iconMap[name];

  // Recherche par mots-clés dans le nom
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('restaurant')) {
    if (lowerName.includes('pizza')) return <Pizza className="h-4 w-4" />;
    if (lowerName.includes('sushi') || lowerName.includes('japonais')) return <Fish className="h-4 w-4" />;
    if (lowerName.includes('végé') || lowerName.includes('bio')) return <Salad className="h-4 w-4" />;
    if (lowerName.includes('fast') || lowerName.includes('rapide')) return <Sandwich className="h-4 w-4" />;
    return <Utensils className="h-4 w-4" />;
  }
  
  if (lowerName.includes('magasin') || lowerName.includes('boutique')) {
    if (lowerName.includes('vêtement') || lowerName.includes('mode')) return <Shirt className="h-4 w-4" />;
    if (lowerName.includes('électro') || lowerName.includes('tech')) return <Smartphone className="h-4 w-4" />;
    if (lowerName.includes('sport')) return <Dumbbell className="h-4 w-4" />;
    if (lowerName.includes('livre')) return <Book className="h-4 w-4" />;
    return <Store className="h-4 w-4" />;
  }

  // Utiliser l'icône de la catégorie parent si disponible
  if (parentCategory) {
    return getCategoryIcon(parentCategory, fallbackIcon);
  }

  // Icône de fallback
  return fallbackIcon ? <span className="text-sm">{fallbackIcon}</span> : <MapPin className="h-4 w-4" />;
};

// Couleurs par défaut pour les catégories si pas définies
export const getDefaultCategoryColor = (name: string) => {
  const colorMap: { [key: string]: string } = {
    'Alimentation et Boissons': '#8b5cf6', // purple
    'Restaurants': '#8b5cf6',
    'Achats': '#06b6d4', // cyan
    'Shopping': '#06b6d4',
    'Commerces': '#06b6d4',
    'Transport': '#f59e0b', // amber
    'Services': '#10b981', // emerald
    'Santé': '#ef4444', // red
    'Éducation': '#3b82f6', // blue
    'Sport': '#f97316', // orange
    'Loisirs': '#ec4899', // pink
    'Famille': '#f59e0b', // amber
    'Travail': '#6366f1', // indigo
    'Autre': '#6b7280' // gray
  };

  return colorMap[name] || '#6366f1';
};