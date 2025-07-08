import React from 'react';
import {
  Utensils, Store, Coffee, ShoppingBag, GraduationCap, Building, Car, Train, Plane,
  Pizza, Beef, Sandwich, Wine, Cookie, Apple, Fish, Salad, 
  Shirt, Gem, Smartphone, Book, Gamepad2, Fuel, Hospital, Cross, Mail, Phone, 
  Wrench, Scissors, Dumbbell, MapPin, Trees, Mountain, Waves, Home, Heart,
  Music, Camera, Palette, Briefcase, UserCheck, Baby, PawPrint,
  Stethoscope, ShoppingCart, Truck, Users, PartyPopper, Flower, Theater, 
  Bus, Church, Landmark, Shield, Hotel, IceCream
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
    'Urgences': <Stethoscope className="h-6 w-6" />,
    'Pompiers': <Stethoscope className="h-6 w-6" />,
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