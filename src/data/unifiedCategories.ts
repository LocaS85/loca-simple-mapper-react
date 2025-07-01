import { 
  Utensils, 
  ShoppingBag, 
  Heart, 
  GraduationCap, 
  Car, 
  Gamepad2, 
  Briefcase, 
  MapPin,
  Home,
  Scissors,
  Dumbbell,
  Plane,
  Building,
  Music,
  Baby,
  Wrench,
  PiggyBank,
  TreePine,
  Camera,
  Users
} from "lucide-react";

export interface UnifiedCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories: UnifiedSubcategory[];
}

export interface UnifiedSubcategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  searchTerms: string[];
}

export const unifiedCategories: UnifiedCategory[] = [
  {
    id: 'restaurants',
    name: 'Restaurants & Alimentation',
    description: 'Restaurants, cafés, bars et alimentation',
    icon: 'Utensils',
    color: '#e67e22',
    subcategories: [
      { id: 'restaurant', name: 'Restaurants', description: 'Tous types de restaurants', icon: 'Utensils', searchTerms: ['restaurant', 'brasserie', 'bistrot'] },
      { id: 'fast-food', name: 'Fast Food', description: 'Restauration rapide', icon: 'Utensils', searchTerms: ['fast food', 'quick', 'burger', 'pizza'] },
      { id: 'cafe', name: 'Cafés & Bars', description: 'Cafés, bars et pubs', icon: 'Utensils', searchTerms: ['café', 'bar', 'pub', 'brasserie'] },
      { id: 'boulangerie', name: 'Boulangeries', description: 'Boulangeries et pâtisseries', icon: 'Utensils', searchTerms: ['boulangerie', 'pâtisserie', 'pain'] },
      { id: 'supermarche', name: 'Supermarchés', description: 'Grandes surfaces alimentaires', icon: 'ShoppingBag', searchTerms: ['supermarché', 'hypermarché', 'courses'] },
      { id: 'epicerie', name: 'Épiceries', description: 'Épiceries de proximité', icon: 'ShoppingBag', searchTerms: ['épicerie', 'alimentaire', 'proximité'] }
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping & Commerce',
    description: 'Magasins, centres commerciaux et boutiques',
    icon: 'ShoppingBag',
    color: '#2ecc71',
    subcategories: [
      { id: 'vetements', name: 'Vêtements', description: 'Boutiques de mode et vêtements', icon: 'ShoppingBag', searchTerms: ['vêtements', 'mode', 'boutique', 'fashion'] },
      { id: 'electronique', name: 'Électronique', description: 'Magasins d\'électronique et high-tech', icon: 'ShoppingBag', searchTerms: ['électronique', 'informatique', 'smartphone', 'ordinateur'] },
      { id: 'centre-commercial', name: 'Centres Commerciaux', description: 'Centres commerciaux et galeries', icon: 'Building', searchTerms: ['centre commercial', 'galerie', 'mall'] },
      { id: 'librairie', name: 'Librairies', description: 'Librairies et papeteries', icon: 'GraduationCap', searchTerms: ['librairie', 'livre', 'papeterie'] },
      { id: 'marche', name: 'Marchés', description: 'Marchés et halles', icon: 'ShoppingBag', searchTerms: ['marché', 'halle', 'marché couvert'] }
    ]
  },
  {
    id: 'sante',
    name: 'Santé & Bien-être',
    description: 'Santé, médecine et bien-être',
    icon: 'Heart',
    color: '#e74c3c',
    subcategories: [
      { id: 'pharmacie', name: 'Pharmacies', description: 'Pharmacies et parapharmacies', icon: 'Heart', searchTerms: ['pharmacie', 'parapharmacie', 'médicament'] },
      { id: 'hopital', name: 'Hôpitaux', description: 'Hôpitaux et cliniques', icon: 'Heart', searchTerms: ['hôpital', 'clinique', 'urgences'] },
      { id: 'medecin', name: 'Médecins', description: 'Cabinets médicaux et spécialistes', icon: 'Heart', searchTerms: ['médecin', 'docteur', 'cabinet médical'] },
      { id: 'dentiste', name: 'Dentistes', description: 'Cabinets dentaires', icon: 'Heart', searchTerms: ['dentiste', 'orthodontiste', 'dentaire'] },
      { id: 'opticien', name: 'Opticiens', description: 'Opticiens et lunetteries', icon: 'Heart', searchTerms: ['opticien', 'lunettes', 'optique'] },
      { id: 'therapie', name: 'Thérapies', description: 'Kinésithérapie, ostéopathie', icon: 'Heart', searchTerms: ['kinésithérapeute', 'ostéopathe', 'thérapie'] }
    ]
  },
  {
    id: 'education',
    name: 'Éducation & Culture',
    description: 'Établissements d\'enseignement et culture',
    icon: 'GraduationCap',
    color: '#3498db',
    subcategories: [
      { id: 'ecole', name: 'Écoles', description: 'Écoles primaires et maternelles', icon: 'GraduationCap', searchTerms: ['école', 'maternelle', 'primaire'] },
      { id: 'college-lycee', name: 'Collèges & Lycées', description: 'Enseignement secondaire', icon: 'GraduationCap', searchTerms: ['collège', 'lycée', 'secondaire'] },
      { id: 'universite', name: 'Universités', description: 'Enseignement supérieur', icon: 'GraduationCap', searchTerms: ['université', 'fac', 'école supérieure'] },
      { id: 'bibliotheque', name: 'Bibliothèques', description: 'Bibliothèques et médiathèques', icon: 'GraduationCap', searchTerms: ['bibliothèque', 'médiathèque', 'BU'] },
      { id: 'musee', name: 'Musées', description: 'Musées et expositions', icon: 'Camera', searchTerms: ['musée', 'exposition', 'galerie'] },
      { id: 'cinema', name: 'Cinémas', description: 'Salles de cinéma', icon: 'Camera', searchTerms: ['cinéma', 'film', 'salle'] }
    ]
  },
  {
    id: 'transport',
    name: 'Transport & Mobilité',
    description: 'Transports publics et services de mobilité',
    icon: 'Car',
    color: '#9b59b6',
    subcategories: [
      { id: 'metro', name: 'Métro', description: 'Stations de métro', icon: 'Car', searchTerms: ['métro', 'station', 'RER'] },
      { id: 'bus', name: 'Bus', description: 'Arrêts de bus et tramway', icon: 'Car', searchTerms: ['bus', 'arrêt', 'tramway'] },
      { id: 'gare', name: 'Gares', description: 'Gares SNCF et routières', icon: 'Car', searchTerms: ['gare', 'SNCF', 'train'] },
      { id: 'taxi', name: 'Taxis', description: 'Stations de taxi et VTC', icon: 'Car', searchTerms: ['taxi', 'VTC', 'uber'] },
      { id: 'parking', name: 'Parkings', description: 'Parkings et stationnements', icon: 'Car', searchTerms: ['parking', 'stationnement', 'garage'] },
      { id: 'station-service', name: 'Stations Service', description: 'Stations essence et recharge', icon: 'Car', searchTerms: ['station service', 'essence', 'carburant'] }
    ]
  },
  {
    id: 'loisirs',
    name: 'Loisirs & Divertissement',
    description: 'Divertissement, sports et loisirs',
    icon: 'Gamepad2',
    color: '#f39c12',
    subcategories: [
      { id: 'parc', name: 'Parcs & Jardins', description: 'Espaces verts et parcs', icon: 'TreePine', searchTerms: ['parc', 'jardin', 'espace vert'] },
      { id: 'theatre', name: 'Théâtres', description: 'Théâtres et spectacles', icon: 'Music', searchTerms: ['théâtre', 'spectacle', 'scène'] },
      { id: 'concert', name: 'Salles de Concert', description: 'Concerts et musique live', icon: 'Music', searchTerms: ['concert', 'salle', 'musique'] },
      { id: 'club', name: 'Clubs & Discothèques', description: 'Vie nocturne et clubs', icon: 'Music', searchTerms: ['club', 'discothèque', 'boîte'] },
      { id: 'casino', name: 'Casinos', description: 'Casinos et jeux', icon: 'Gamepad2', searchTerms: ['casino', 'jeux', 'poker'] },
      { id: 'bowling', name: 'Bowling & Jeux', description: 'Bowling, laser game, escape game', icon: 'Gamepad2', searchTerms: ['bowling', 'laser game', 'escape game'] }
    ]
  },
  {
    id: 'services',
    name: 'Services & Administration',
    description: 'Services publics et administration',
    icon: 'Briefcase',
    color: '#34495e',
    subcategories: [
      { id: 'mairie', name: 'Mairies', description: 'Mairies et services municipaux', icon: 'Building', searchTerms: ['mairie', 'municipal', 'administration'] },
      { id: 'poste', name: 'La Poste', description: 'Bureau de poste et relais', icon: 'Briefcase', searchTerms: ['poste', 'courrier', 'colis'] },
      { id: 'banque', name: 'Banques', description: 'Agences bancaires et DAB', icon: 'PiggyBank', searchTerms: ['banque', 'DAB', 'distributeur'] },
      { id: 'assurance', name: 'Assurances', description: 'Agences d\'assurance', icon: 'Briefcase', searchTerms: ['assurance', 'mutuelle', 'agent'] },
      { id: 'notaire', name: 'Notaires', description: 'Études notariales', icon: 'Briefcase', searchTerms: ['notaire', 'étude', 'acte'] },
      { id: 'avocat', name: 'Avocats', description: 'Cabinets d\'avocats', icon: 'Briefcase', searchTerms: ['avocat', 'cabinet', 'juridique'] }
    ]
  },
  {
    id: 'sport',
    name: 'Sport & Fitness',
    description: 'Installations sportives et fitness',
    icon: 'Dumbbell',
    color: '#e67e22',
    subcategories: [
      { id: 'salle-sport', name: 'Salles de Sport', description: 'Fitness et musculation', icon: 'Dumbbell', searchTerms: ['salle de sport', 'fitness', 'musculation'] },
      { id: 'piscine', name: 'Piscines', description: 'Piscines publiques et privées', icon: 'Dumbbell', searchTerms: ['piscine', 'natation', 'aquatique'] },
      { id: 'tennis', name: 'Tennis', description: 'Courts de tennis et clubs', icon: 'Dumbbell', searchTerms: ['tennis', 'court', 'club'] },
      { id: 'stade', name: 'Stades', description: 'Stades et terrains de sport', icon: 'Dumbbell', searchTerms: ['stade', 'terrain', 'football'] },
      { id: 'yoga', name: 'Yoga & Pilates', description: 'Studios de yoga et pilates', icon: 'Heart', searchTerms: ['yoga', 'pilates', 'méditation'] }
    ]
  },
  {
    id: 'beaute',
    name: 'Beauté & Esthétique',
    description: 'Soins de beauté et esthétique',
    icon: 'Scissors',
    color: '#e91e63',
    subcategories: [
      { id: 'coiffeur', name: 'Coiffeurs', description: 'Salons de coiffure', icon: 'Scissors', searchTerms: ['coiffeur', 'salon', 'coiffure'] },
      { id: 'esthetique', name: 'Esthétique', description: 'Instituts de beauté', icon: 'Scissors', searchTerms: ['esthétique', 'institut', 'beauté'] },
      { id: 'manucure', name: 'Manucure', description: 'Soins des ongles', icon: 'Scissors', searchTerms: ['manucure', 'onglerie', 'ongles'] },
      { id: 'massage', name: 'Massages', description: 'Salons de massage', icon: 'Heart', searchTerms: ['massage', 'spa', 'détente'] },
      { id: 'parfumerie', name: 'Parfumeries', description: 'Parfumeries et cosmétiques', icon: 'Scissors', searchTerms: ['parfumerie', 'cosmétique', 'parfum'] }
    ]
  },
  {
    id: 'hotellerie',
    name: 'Hôtellerie & Tourisme',
    description: 'Hébergement et services touristiques',
    icon: 'Plane',
    color: '#16a085',
    subcategories: [
      { id: 'hotel', name: 'Hôtels', description: 'Hôtels et hébergements', icon: 'Plane', searchTerms: ['hôtel', 'hébergement', 'chambre'] },
      { id: 'camping', name: 'Campings', description: 'Campings et villages vacances', icon: 'TreePine', searchTerms: ['camping', 'caravane', 'mobile home'] },
      { id: 'office-tourisme', name: 'Offices de Tourisme', description: 'Information touristique', icon: 'Plane', searchTerms: ['office de tourisme', 'information', 'guide'] },
      { id: 'agence-voyage', name: 'Agences de Voyage', description: 'Agences de voyages et tours', icon: 'Plane', searchTerms: ['agence voyage', 'tour', 'circuit'] }
    ]
  },
  {
    id: 'enfants',
    name: 'Enfants & Famille',
    description: 'Services et loisirs pour enfants',
    icon: 'Baby',
    color: '#ff6b6b',
    subcategories: [
      { id: 'creche', name: 'Crèches', description: 'Crèches et garderies', icon: 'Baby', searchTerms: ['crèche', 'garderie', 'enfant'] },
      { id: 'pediatre', name: 'Pédiatres', description: 'Médecins pour enfants', icon: 'Heart', searchTerms: ['pédiatre', 'enfant', 'bébé'] },
      { id: 'aire-jeux', name: 'Aires de Jeux', description: 'Parcs pour enfants', icon: 'Baby', searchTerms: ['aire de jeux', 'parc enfant', 'jeux'] },
      { id: 'jouets', name: 'Magasins de Jouets', description: 'Boutiques de jouets', icon: 'Baby', searchTerms: ['jouets', 'magasin', 'enfant'] }
    ]
  },
  {
    id: 'bricolage',
    name: 'Bricolage & Maison',
    description: 'Bricolage, jardinage et maison',
    icon: 'Wrench',
    color: '#95a5a6',
    subcategories: [
      { id: 'bricolage', name: 'Magasins de Bricolage', description: 'Outillage et matériaux', icon: 'Wrench', searchTerms: ['bricolage', 'outillage', 'matériaux'] },
      { id: 'jardinage', name: 'Jardinage', description: 'Jardineries et pépinières', icon: 'TreePine', searchTerms: ['jardinage', 'jardinerie', 'plantes'] },
      { id: 'decoration', name: 'Décoration', description: 'Magasins de décoration', icon: 'Home', searchTerms: ['décoration', 'déco', 'mobilier'] },
      { id: 'electromenager', name: 'Électroménager', description: 'Appareils électroménagers', icon: 'Wrench', searchTerms: ['électroménager', 'appareil', 'cuisine'] }
    ]
  },
  {
    id: 'quotidien',
    name: 'Lieux Quotidiens',
    description: 'Domicile, travail et lieux personnels',
    icon: 'MapPin',
    color: '#74b9ff',
    subcategories: [
      { id: 'domicile', name: 'Domicile', description: 'Votre domicile principal', icon: 'Home', searchTerms: ['domicile', 'maison', 'chez moi'] },
      { id: 'travail', name: 'Travail', description: 'Votre lieu de travail', icon: 'Briefcase', searchTerms: ['travail', 'bureau', 'entreprise'] },
      { id: 'famille', name: 'Famille', description: 'Chez la famille et amis', icon: 'Users', searchTerms: ['famille', 'amis', 'proche'] },
      { id: 'autre', name: 'Autres Lieux', description: 'Autres lieux personnels', icon: 'MapPin', searchTerms: ['autre', 'personnel', 'lieu'] }
    ]
  }
];

// Export des catégories et sous-catégories pour compatibilité
export const categories = unifiedCategories;
export const allSubcategories = unifiedCategories.flatMap(cat => 
  cat.subcategories.map(sub => ({ ...sub, parentId: cat.id }))
);

// Helper functions
export const getCategoryById = (id: string): UnifiedCategory | undefined => {
  return unifiedCategories.find(cat => cat.id === id);
};

export const getSubcategoryById = (id: string): UnifiedSubcategory | undefined => {
  return allSubcategories.find(sub => sub.id === id);
};

export const getCategoryBySubcategoryId = (subcategoryId: string): UnifiedCategory | undefined => {
  return unifiedCategories.find(cat => 
    cat.subcategories.some(sub => sub.id === subcategoryId)
  );
};