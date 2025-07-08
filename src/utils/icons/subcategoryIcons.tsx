import React from 'react';
import {
  Utensils, Store, Coffee, Sandwich, Wine, Cookie, Apple, Fish, Salad, 
  Shirt, Gem, Watch, Smartphone, Laptop, Book, Gamepad2, Fuel, Hospital, 
  Cross, Mail, Phone, Wrench, Scissors, Dumbbell, MapPin, Trees, Mountain, 
  Waves, Home, Heart, Music, Camera, Palette, Briefcase, UserCheck, Baby, 
  PawPrint, Stethoscope, ShoppingCart, Truck, Activity, Zap, Users, 
  PartyPopper, Flower, Theater, Bus, Church, Landmark, Shield, Hotel, 
  IceCream, Beer, Search, Pizza, Building, GraduationCap, Car, Train, Plane
} from 'lucide-react';
import { getCategoryIcon } from './categoryIcons';

// Mapping des icônes pour les sous-catégories
export const getSubcategoryIcon = (name: string, parentCategory?: string, fallbackIcon?: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    // Restaurants et Alimentation
    'Restaurants Gastronomiques': <Utensils className="h-4 w-4" />,
    'Restaurants Rapides': <Sandwich className="h-4 w-4" />,
    'Restaurants Végétariens': <Salad className="h-4 w-4" />,
    'Restaurants Sushi': <Fish className="h-4 w-4" />,
    'Pizzerias': <Pizza className="h-4 w-4" />,
    'Cuisine du Monde': <Utensils className="h-4 w-4" />,
    'Boulangeries': <Cookie className="h-4 w-4" />,
    'Pâtisseries': <Cookie className="h-4 w-4" />,
    'Fast Food': <Sandwich className="h-4 w-4" />,
    'Brasseries': <Beer className="h-4 w-4" />,
    'Bars': <Wine className="h-4 w-4" />,
    'Bars à Vins': <Wine className="h-4 w-4" />,
    'Cafés': <Coffee className="h-4 w-4" />,
    'Épiceries': <Apple className="h-4 w-4" />,
    'Épiceries Fines': <Apple className="h-4 w-4" />,
    'Marché': <Apple className="h-4 w-4" />,
    'Boucheries': <Sandwich className="h-4 w-4" />,
    'Poissonneries': <Fish className="h-4 w-4" />,
    'Fromageries': <Cookie className="h-4 w-4" />,
    'Cavistes': <Wine className="h-4 w-4" />,
    'Traiteurs': <Utensils className="h-4 w-4" />,
    'Chocolatiers': <Cookie className="h-4 w-4" />,
    'Glaciers': <IceCream className="h-4 w-4" />,
    
    // Shopping et Commerce
    'Magasins de Vêtements': <Shirt className="h-4 w-4" />,
    'Mode Homme': <Shirt className="h-4 w-4" />,
    'Mode Femme': <Shirt className="h-4 w-4" />,
    'Mode Enfant': <Baby className="h-4 w-4" />,
    'Chaussures': <Shirt className="h-4 w-4" />,
    'Bijouteries': <Gem className="h-4 w-4" />,
    'Horlogeries': <Watch className="h-4 w-4" />,
    'Magasins d\'Électronique': <Smartphone className="h-4 w-4" />,
    'Informatique': <Laptop className="h-4 w-4" />,
    'Téléphonie': <Phone className="h-4 w-4" />,
    'Librairies': <Book className="h-4 w-4" />,
    'Magasins de Sport': <Dumbbell className="h-4 w-4" />,
    'Centres Commerciaux': <Building className="h-4 w-4" />,
    'Grands Magasins': <Building className="h-4 w-4" />,
    'Supermarchés': <ShoppingCart className="h-4 w-4" />,
    'Hypermarchés': <ShoppingCart className="h-4 w-4" />,
    'Magasins Bio': <Apple className="h-4 w-4" />,
    'Magasins de Jouets': <Gamepad2 className="h-4 w-4" />,
    'Animaleries': <PawPrint className="h-4 w-4" />,
    'Jardineries': <Flower className="h-4 w-4" />,
    'Bricolage': <Wrench className="h-4 w-4" />,
    'Ameublement': <Home className="h-4 w-4" />,
    'Décoration': <Palette className="h-4 w-4" />,
    'Optique': <Search className="h-4 w-4" />,
    
    // Services
    'Banques': <Building className="h-4 w-4" />,
    'Bureaux de Poste': <Mail className="h-4 w-4" />,
    'Salons de Coiffure': <Scissors className="h-4 w-4" />,
    'Instituts de Beauté': <Flower className="h-4 w-4" />,
    'Spas': <Flower className="h-4 w-4" />,
    'Massage': <Heart className="h-4 w-4" />,
    'Garages': <Wrench className="h-4 w-4" />,
    'Stations Service': <Fuel className="h-4 w-4" />,
    'Centres Auto': <Car className="h-4 w-4" />,
    'Assurances': <Shield className="h-4 w-4" />,
    'Agences Immobilières': <Home className="h-4 w-4" />,
    'Notaires': <Briefcase className="h-4 w-4" />,
    'Avocats': <Briefcase className="h-4 w-4" />,
    'Comptables': <Briefcase className="h-4 w-4" />,
    'Pressing': <Shirt className="h-4 w-4" />,
    'Cordonneries': <Wrench className="h-4 w-4" />,
    'Serruriers': <Wrench className="h-4 w-4" />,
    'Électriciens': <Zap className="h-4 w-4" />,
    'Plombiers': <Wrench className="h-4 w-4" />,
    'Maçons': <Wrench className="h-4 w-4" />,
    'Peintres': <Palette className="h-4 w-4" />,
    'Menuisiers': <Wrench className="h-4 w-4" />,
    'Couvreurs': <Home className="h-4 w-4" />,
    'Paysagistes': <Trees className="h-4 w-4" />,
    'Déménageurs': <Truck className="h-4 w-4" />,
    'Nettoyage': <Wrench className="h-4 w-4" />,
    'Sécurité': <Shield className="h-4 w-4" />,
    'Alarmes': <Shield className="h-4 w-4" />,
    'Télécommunications': <Phone className="h-4 w-4" />,
    'Internet': <Smartphone className="h-4 w-4" />,
    'Réparation': <Wrench className="h-4 w-4" />,
    
    // Santé
    'Hôpitaux': <Hospital className="h-4 w-4" />,
    'Cliniques': <Hospital className="h-4 w-4" />,
    'Pharmacies': <Cross className="h-4 w-4" />,
    'Cabinets Médicaux': <Stethoscope className="h-4 w-4" />,
    'Médecins Généralistes': <Stethoscope className="h-4 w-4" />,
    'Spécialistes': <Stethoscope className="h-4 w-4" />,
    'Dentistes': <UserCheck className="h-4 w-4" />,
    'Orthodontistes': <UserCheck className="h-4 w-4" />,
    'Ophtalmologues': <Search className="h-4 w-4" />,
    'Dermatologues': <UserCheck className="h-4 w-4" />,
    'Gynécologues': <UserCheck className="h-4 w-4" />,
    'Pédiatres': <Baby className="h-4 w-4" />,
    'Cardiologues': <Heart className="h-4 w-4" />,
    'Radiologues': <Activity className="h-4 w-4" />,
    'Laboratoires': <Activity className="h-4 w-4" />,
    'Kinésithérapeutes': <Dumbbell className="h-4 w-4" />,
    'Ostéopathes': <Dumbbell className="h-4 w-4" />,
    'Chiropracteurs': <Dumbbell className="h-4 w-4" />,
    'Psychologues': <UserCheck className="h-4 w-4" />,
    'Psychiatres': <UserCheck className="h-4 w-4" />,
    'Infirmiers': <Cross className="h-4 w-4" />,
    'Sages-femmes': <Baby className="h-4 w-4" />,
    'Vétérinaires': <PawPrint className="h-4 w-4" />,
    'Cliniques Vétérinaires': <PawPrint className="h-4 w-4" />,
    
    // Éducation
    'Écoles Primaires': <GraduationCap className="h-4 w-4" />,
    'Écoles Maternelles': <Baby className="h-4 w-4" />,
    'Collèges': <GraduationCap className="h-4 w-4" />,
    'Lycées': <GraduationCap className="h-4 w-4" />,
    'Universités': <GraduationCap className="h-4 w-4" />,
    'Grandes Écoles': <GraduationCap className="h-4 w-4" />,
    'Écoles Supérieures': <GraduationCap className="h-4 w-4" />,
    'Formations Professionnelles': <GraduationCap className="h-4 w-4" />,
    'Crèches': <Baby className="h-4 w-4" />,
    'Halte-garderies': <Baby className="h-4 w-4" />,
    'Centres de Loisirs': <PartyPopper className="h-4 w-4" />,
    'Bibliothèques': <Book className="h-4 w-4" />,
    'Médiathèques': <Book className="h-4 w-4" />,
    'Archives': <Book className="h-4 w-4" />,
    'Auto-écoles': <Car className="h-4 w-4" />,
    'Écoles de Musique': <Music className="h-4 w-4" />,
    'Écoles de Danse': <Music className="h-4 w-4" />,
    'Écoles d\'Art': <Palette className="h-4 w-4" />,
    'Écoles de Langues': <Book className="h-4 w-4" />,
    'Cours Particuliers': <Book className="h-4 w-4" />,
    'Soutien Scolaire': <Book className="h-4 w-4" />,
    
    // Loisirs et Culture
    'Cinémas': <Camera className="h-4 w-4" />,
    'Théâtres': <Theater className="h-4 w-4" />,
    'Opéras': <Music className="h-4 w-4" />,
    'Concerts': <Music className="h-4 w-4" />,
    'Salles de Spectacle': <Theater className="h-4 w-4" />,
    'Musées': <Palette className="h-4 w-4" />,
    'Galeries d\'Art': <Palette className="h-4 w-4" />,
    'Centres Culturels': <Palette className="h-4 w-4" />,
    'Monuments': <Landmark className="h-4 w-4" />,
    'Sites Historiques': <Landmark className="h-4 w-4" />,
    'Châteaux': <Landmark className="h-4 w-4" />,
    'Églises': <Church className="h-4 w-4" />,
    'Cathédrales': <Church className="h-4 w-4" />,
    'Parcs': <Trees className="h-4 w-4" />,
    'Jardins': <Trees className="h-4 w-4" />,
    'Espaces Verts': <Trees className="h-4 w-4" />,
    'Forêts': <Trees className="h-4 w-4" />,
    'Plages': <Waves className="h-4 w-4" />,
    'Lacs': <Waves className="h-4 w-4" />,
    'Rivières': <Waves className="h-4 w-4" />,
    'Montagnes': <Mountain className="h-4 w-4" />,
    'Randonnées': <Mountain className="h-4 w-4" />,
    'Sentiers': <Mountain className="h-4 w-4" />,
    'Piscines': <Waves className="h-4 w-4" />,
    'Centres Aquatiques': <Waves className="h-4 w-4" />,
    'Salles de Sport': <Dumbbell className="h-4 w-4" />,
    'Fitness': <Dumbbell className="h-4 w-4" />,
    'Gymnases': <Dumbbell className="h-4 w-4" />,
    'Terrains de Sport': <Dumbbell className="h-4 w-4" />,
    'Stades': <Dumbbell className="h-4 w-4" />,
    'Clubs de Sport': <Dumbbell className="h-4 w-4" />,
    'Tennis': <Dumbbell className="h-4 w-4" />,
    'Golf': <Dumbbell className="h-4 w-4" />,
    'Bowling': <Gamepad2 className="h-4 w-4" />,
    'Billard': <Gamepad2 className="h-4 w-4" />,
    'Escape Game': <Gamepad2 className="h-4 w-4" />,
    'Laser Game': <Gamepad2 className="h-4 w-4" />,
    'Paintball': <Gamepad2 className="h-4 w-4" />,
    'Karting': <Car className="h-4 w-4" />,
    'Parc d\'Attractions': <PartyPopper className="h-4 w-4" />,
    'Parcs de Loisirs': <PartyPopper className="h-4 w-4" />,
    'Zoos': <PawPrint className="h-4 w-4" />,
    'Aquariums': <Fish className="h-4 w-4" />,
    'Casinos': <Gamepad2 className="h-4 w-4" />,
    'Discothèques': <Music className="h-4 w-4" />,
    'Bars de Nuit': <Wine className="h-4 w-4" />,
    'Clubs': <Music className="h-4 w-4" />,
    'Karaokés': <Music className="h-4 w-4" />,
    
    // Transport
    'Aéroports': <Plane className="h-4 w-4" />,
    'Aérodromes': <Plane className="h-4 w-4" />,
    'Gares SNCF': <Train className="h-4 w-4" />,
    'Gares Routières': <Bus className="h-4 w-4" />,
    'Métro': <Train className="h-4 w-4" />,
    'Tramway': <Train className="h-4 w-4" />,
    'Bus': <Bus className="h-4 w-4" />,
    'Navettes': <Bus className="h-4 w-4" />,
    'Taxis': <Car className="h-4 w-4" />,
    'VTC': <Car className="h-4 w-4" />,
    'Location de Voitures': <Car className="h-4 w-4" />,
    'Parkings': <Car className="h-4 w-4" />,
    'Parkings Payants': <Car className="h-4 w-4" />,
    'Parkings Gratuits': <Car className="h-4 w-4" />,
    'Vélos en Libre-Service': <Fuel className="h-4 w-4" />,
    'Location de Vélos': <Fuel className="h-4 w-4" />,
    'Trottinettes': <Fuel className="h-4 w-4" />,
    'Ports': <Waves className="h-4 w-4" />,
    'Marinas': <Waves className="h-4 w-4" />,
    'Péages': <Car className="h-4 w-4" />,
    'Aires d\'Autoroute': <Car className="h-4 w-4" />,
    
    // Hébergement
    'Hôtels': <Hotel className="h-4 w-4" />,
    'Hôtels de Luxe': <Hotel className="h-4 w-4" />,
    'Auberges': <Hotel className="h-4 w-4" />,
    'Auberges de Jeunesse': <Hotel className="h-4 w-4" />,
    'Chambres d\'Hôtes': <Hotel className="h-4 w-4" />,
    'Gîtes': <Home className="h-4 w-4" />,
    'Campings': <Home className="h-4 w-4" />,
    'Villages Vacances': <Home className="h-4 w-4" />,
    'Résidences de Tourisme': <Hotel className="h-4 w-4" />,
    'Appartements': <Home className="h-4 w-4" />,
    'Locations Saisonnières': <Home className="h-4 w-4" />
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