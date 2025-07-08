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
  Landmark, Shield, Hotel, IceCream, Beer, Search
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
    'Boucheries': <Beef className="h-4 w-4" />,
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