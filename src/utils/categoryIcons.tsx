import React from 'react';
import { 
  Utensils, Store, Coffee, ShoppingBag, GraduationCap, Building, Car, Train, Plane,
  Pizza, Beef, Sandwich, Wine, Cookie, Apple, Fish, Salad, 
  Shirt, Gem, Watch, Smartphone, Laptop, Book, Gamepad2,
  Fuel, Hospital, Cross, Mail, Phone, Wrench, Scissors,
  Dumbbell, MapPin, Trees, Mountain, Waves, Sun, Home, Heart,
  Music, Camera, Palette, Briefcase, UserCheck, Baby, PawPrint,
  Stethoscope, ShoppingCart, Truck, Activity, Bed, Zap,
  Users, PartyPopper, Flower, Theater, Bus, Church, Clock,
  Landmark, Shield, Hotel, IceCream
} from 'lucide-react';

// Mapping des icônes pour les catégories principales
export const getCategoryIcon = (name: string, fallbackIcon?: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    // Alimentation et Boissons
    'Alimentation et Boissons': <Utensils className="h-6 w-6" />,
    'Restaurants': <Utensils className="h-6 w-6" />,
    'Cafés': <Coffee className="h-6 w-6" />,
    'Bars': <Wine className="h-6 w-6" />,
    'Fast Food': <Sandwich className="h-6 w-6" />,
    'Boulangeries': <Cookie className="h-6 w-6" />,
    'Glaciers': <IceCream className="h-6 w-6" />,
    
    // Shopping et Commerce
    'Achats': <ShoppingBag className="h-6 w-6" />,
    'Shopping': <ShoppingBag className="h-6 w-6" />,
    'Commerces': <Store className="h-6 w-6" />,
    'Mode': <Shirt className="h-6 w-6" />,
    'Bijouterie': <Gem className="h-6 w-6" />,
    'Électronique': <Smartphone className="h-6 w-6" />,
    'Supermarchés': <ShoppingCart className="h-6 w-6" />,
    'Librairies': <Book className="h-6 w-6" />,
    
    // Éducation et Culture
    'Éducation': <GraduationCap className="h-6 w-6" />,
    'École': <GraduationCap className="h-6 w-6" />,
    'Bibliothèque': <Book className="h-6 w-6" />,
    'Musée': <Palette className="h-6 w-6" />,
    'Cinéma': <Camera className="h-6 w-6" />,
    'Théâtre': <Theater className="h-6 w-6" />,
    'Universités': <GraduationCap className="h-6 w-6" />,
    
    // Transport
    'Transport': <Car className="h-6 w-6" />,
    'Voiture': <Car className="h-6 w-6" />,
    'Train': <Train className="h-6 w-6" />,
    'Aéroport': <Plane className="h-6 w-6" />,
    'Aérodrome': <Plane className="h-6 w-6" />,
    'Transport Public': <Bus className="h-6 w-6" />,
    'Stations Service': <Fuel className="h-6 w-6" />,
    'Parking': <Car className="h-6 w-6" />,
    
    // Services
    'Services': <Building className="h-6 w-6" />,
    'Banque': <Building className="h-6 w-6" />,
    'Poste': <Mail className="h-6 w-6" />,
    'Réparation': <Wrench className="h-6 w-6" />,
    'Administration': <Landmark className="h-6 w-6" />,
    'Sécurité': <Shield className="h-6 w-6" />,
    'Télécommunications': <Phone className="h-6 w-6" />,
    
    // Santé et Bien-être
    'Santé': <Stethoscope className="h-6 w-6" />,
    'Hôpital': <Hospital className="h-6 w-6" />,
    'Pharmacie': <Cross className="h-6 w-6" />,
    'Médecins': <Stethoscope className="h-6 w-6" />,
    'Bien-être': <Heart className="h-6 w-6" />,
    'Spas': <Flower className="h-6 w-6" />,
    
    // Sport et Loisirs
    'Sport': <Dumbbell className="h-6 w-6" />,
    'Fitness': <Dumbbell className="h-6 w-6" />,
    'Loisirs': <Gamepad2 className="h-6 w-6" />,
    'Parcs et Nature': <Trees className="h-6 w-6" />,
    'Parc': <Trees className="h-6 w-6" />,
    'Activités de Plein Air': <Mountain className="h-6 w-6" />,
    'Divertissement': <PartyPopper className="h-6 w-6" />,
    'Vie Nocturne': <Music className="h-6 w-6" />,
    
    // Hébergement et Tourisme
    'Hébergement': <Hotel className="h-6 w-6" />,
    'Hôtels': <Hotel className="h-6 w-6" />,
    'Tourisme': <Camera className="h-6 w-6" />,
    'Sites Touristiques': <Landmark className="h-6 w-6" />,
    
    // Services Professionnels
    'Services Professionnels': <Briefcase className="h-6 w-6" />,
    'Entreprises': <Building className="h-6 w-6" />,
    'Immobilier': <Home className="h-6 w-6" />,
    'Juridique': <Briefcase className="h-6 w-6" />,
    
    // Religion et Spiritualité
    'Religion': <Church className="h-6 w-6" />,
    'Lieux de Culte': <Church className="h-6 w-6" />,
    
    // Services d'Urgence
    'Urgences': <Zap className="h-6 w-6" />,
    'Pompiers': <Zap className="h-6 w-6" />,
    'Police': <Shield className="h-6 w-6" />,
    
    // Famille et Personnel
    'Famille': <Users className="h-6 w-6" />,
    'Travail': <Briefcase className="h-6 w-6" />,
    'Adresse principale': <Home className="h-6 w-6" />,
    'Autre': <MapPin className="h-6 w-6" />,
    
    // Services aux Animaux
    'Animaux': <PawPrint className="h-6 w-6" />,
    'Vétérinaires': <PawPrint className="h-6 w-6" />
  };

  // Recherche par nom exact
  if (iconMap[name]) return iconMap[name];

  // Recherche par mots-clés
  const lowerName = name.toLowerCase();
  
  // Alimentation
  if (lowerName.includes('restaurant') || lowerName.includes('manger')) return <Utensils className="h-6 w-6" />;
  if (lowerName.includes('café') || lowerName.includes('coffee')) return <Coffee className="h-6 w-6" />;
  if (lowerName.includes('pizza')) return <Pizza className="h-6 w-6" />;
  if (lowerName.includes('bar') || lowerName.includes('boisson')) return <Wine className="h-6 w-6" />;
  
  // Shopping
  if (lowerName.includes('shop') || lowerName.includes('magasin') || lowerName.includes('boutique')) return <Store className="h-6 w-6" />;
  if (lowerName.includes('vêtement') || lowerName.includes('mode')) return <Shirt className="h-6 w-6" />;
  
  // Transport
  if (lowerName.includes('voiture') || lowerName.includes('auto') || lowerName.includes('parking')) return <Car className="h-6 w-6" />;
  if (lowerName.includes('train') || lowerName.includes('gare')) return <Train className="h-6 w-6" />;
  if (lowerName.includes('avion') || lowerName.includes('aéro')) return <Plane className="h-6 w-6" />;
  
  // Services
  if (lowerName.includes('banque') || lowerName.includes('bank')) return <Building className="h-6 w-6" />;
  if (lowerName.includes('hôpital') || lowerName.includes('médical')) return <Hospital className="h-6 w-6" />;
  if (lowerName.includes('école') || lowerName.includes('university')) return <GraduationCap className="h-6 w-6" />;
  
  // Défaut
  return fallbackIcon ? <span className="text-sm">{fallbackIcon}</span> : <MapPin className="h-6 w-6" />;
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
    // Alimentation et Boissons
    'Alimentation et Boissons': '#8b5cf6', // purple
    'Restaurants': '#8b5cf6',
    'Cafés': '#6b46c1',
    'Bars': '#7c3aed',
    'Boulangeries': '#a855f7',
    'Glaciers': '#c084fc',
    
    // Shopping et Commerce
    'Achats': '#06b6d4', // cyan
    'Shopping': '#06b6d4',
    'Commerces': '#0891b2',
    'Supermarchés': '#0e7490',
    'Mode': '#0284c7',
    'Électronique': '#0369a1',
    
    // Éducation et Culture
    'Éducation': '#3b82f6', // blue
    'École': '#3b82f6',
    'Universités': '#2563eb',
    'Bibliothèque': '#1d4ed8',
    'Musée': '#1e40af',
    'Cinéma': '#1e3a8a',
    'Théâtre': '#312e81',
    
    // Transport
    'Transport': '#f59e0b', // amber
    'Transport Public': '#f59e0b',
    'Aéroport': '#d97706',
    'Stations Service': '#b45309',
    'Parking': '#92400e',
    
    // Services
    'Services': '#10b981', // emerald
    'Services Professionnels': '#10b981',
    'Administration': '#059669',
    'Banque': '#047857',
    'Sécurité': '#065f46',
    
    // Santé et Bien-être
    'Santé': '#ef4444', // red
    'Hôpital': '#ef4444',
    'Pharmacie': '#dc2626',
    'Médecins': '#b91c1c',
    'Bien-être': '#991b1b',
    'Spas': '#7f1d1d',
    
    // Sport et Loisirs
    'Sport': '#f97316', // orange
    'Fitness': '#f97316',
    'Loisirs': '#ec4899', // pink
    'Parcs et Nature': '#22c55e', // green
    'Activités de Plein Air': '#16a34a',
    'Divertissement': '#e879f9',
    'Vie Nocturne': '#d946ef',
    
    // Hébergement et Tourisme
    'Hébergement': '#8b5cf6', // purple
    'Hôtels': '#8b5cf6',
    'Tourisme': '#a855f7',
    'Sites Touristiques': '#c084fc',
    
    // Religion et Spiritualité
    'Religion': '#6366f1', // indigo
    'Lieux de Culte': '#6366f1',
    
    // Services d'Urgence
    'Urgences': '#dc2626', // red
    'Pompiers': '#dc2626',
    'Police': '#1e40af', // blue
    
    // Famille et Personnel
    'Famille': '#f59e0b', // amber
    'Travail': '#6366f1', // indigo
    'Adresse principale': '#22c55e', // green
    'Autre': '#6b7280', // gray
    
    // Services aux Animaux
    'Animaux': '#8b5cf6', // purple
    'Vétérinaires': '#7c3aed'
  };

  return colorMap[name] || '#6366f1';
};