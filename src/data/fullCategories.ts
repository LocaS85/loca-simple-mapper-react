
import { 
  Utensils, ShoppingBag, HeartPulse, Film, Hotel, MapPin, Home, 
  Briefcase, Users, School, CircleUser, Coffee, Beer, Cake, 
  ShoppingCart, Package, Smartphone, Book, Gamepad, Pills, Spray, 
  Sparkles, Glasses, Dumbbell, Flower, Scissors, Car, BadgePercent,
  Building, CircleDollarSign, HeartCrack, Stethoscope, Pill, Flask, 
  Eye, FileImage, Brain, PawPrint, Clapperboard, Theater, Landmark,
  Ticket, Music, PartyPopper, Trees, Blocks, Timer, Infinity, Waves,
  Building2, Tent, BedDouble, Mailbox, Sunrise
} from "lucide-react";
import { ComponentType } from "react";

export interface SubcategoryGroup {
  name: string;
  subcategories: string[];
}

export interface FullSubcategory {
  id: string;
  name: string;
  icon: ComponentType;
  description?: string;
}

export interface FullCategory {
  id: string;
  name: string;
  icon: ComponentType;
  color: string;
  subcategories: FullSubcategory[];
}

export const fullCategoriesData: FullCategory[] = [
  {
    id: 'quotidien',
    name: 'Quotidien',
    icon: MapPin,
    color: '#3498db',
    subcategories: [
      { id: 'maison', name: 'Adresse principale', icon: Home, description: 'Votre domicile principal' },
      { id: 'famille', name: 'Famille', icon: Users, description: 'Adresses de membres de votre famille' },
      { id: 'amis', name: 'Amis', icon: CircleUser, description: 'Adresses de vos amis' },
      { id: 'travail', name: 'Travail', icon: Briefcase, description: 'Adresse de votre lieu de travail' },
      { id: 'ecole', name: 'École', icon: School, description: 'Établissements scolaires' },
      { id: 'autre', name: 'Autre', icon: MapPin, description: 'Autres adresses fréquentes' }
    ]
  },
  {
    id: 'alimentation',
    name: 'Alimentation',
    icon: Utensils,
    color: '#e67e22',
    subcategories: [
      { id: 'restaurants', name: 'Restaurants', icon: Utensils, description: 'Gastronomie, rapide, végétariens, etc.' },
      { id: 'bars', name: 'Bars', icon: Beer, description: 'Bars à vin, pubs, bars à cocktails' },
      { id: 'cafes', name: 'Cafés et Salons de thé', icon: Coffee, description: 'Cafés, salons de thé' },
      { id: 'boulangeries', name: 'Boulangeries', icon: Cake, description: 'Boulangeries et pâtisseries' },
      { id: 'supermarches', name: 'Supermarchés', icon: ShoppingCart, description: 'Grandes surfaces et épiceries' },
      { id: 'emporter', name: 'Vente à emporter', icon: Package, description: 'Plats à emporter' },
      { id: 'livraison', name: 'Livraison', icon: Package, description: 'Services de livraison de repas' }
    ]
  },
  {
    id: 'achats',
    name: 'Achats',
    icon: ShoppingBag,
    color: '#2ecc71',
    subcategories: [
      { id: 'vetements', name: 'Magasins de vêtements', icon: ShoppingBag, description: 'Prêt-à-porter, boutiques de luxe' },
      { id: 'electronique', name: 'Magasins d\'électronique', icon: Smartphone, description: 'Téléphonie, informatique' },
      { id: 'bibliotheques', name: 'Bibliothèques', icon: Book, description: 'Généralistes, spécialisées' },
      { id: 'jouets', name: 'Magasins de jouets', icon: Gamepad, description: 'Jouets et jeux' },
      { id: 'pharmacies', name: 'Pharmacies', icon: Pills, description: 'Pharmacies' },
      { id: 'parfumeries', name: 'Parfumeries', icon: Spray, description: 'Parfumeries et cosmétiques' },
      { id: 'bijouteries', name: 'Bijouteries', icon: Sparkles, description: 'Bijoux et accessoires' },
      { id: 'opticiens', name: 'Opticiens', icon: Glasses, description: 'Lunettes et optique' },
      { id: 'sport', name: 'Magasins de sport', icon: Dumbbell, description: 'Articles de sport' },
      { id: 'fleuristes', name: 'Fleuristes', icon: Flower, description: 'Fleurs et plantes' },
      { id: 'coiffeurs', name: 'Coiffeurs', icon: Scissors, description: 'Salons de coiffure et barbiers' },
      { id: 'beaute', name: 'Beauté', icon: Sparkles, description: 'Salons de beauté, spa, esthétique' },
      { id: 'automobile', name: 'Automobile', icon: Car, description: 'Garages, parking, stations-service' },
      { id: 'banques', name: 'Banques et DAB', icon: CircleDollarSign, description: 'Services bancaires, distributeurs' }
    ]
  },
  {
    id: 'services',
    name: 'Services',
    icon: BadgePercent,
    color: '#f1c40f',
    subcategories: [
      { id: 'pressing', name: 'Pressing', icon: Scissors, description: 'Nettoyage et repassage' },
      { id: 'banque', name: 'Banques', icon: Building, description: 'Services bancaires' },
      { id: 'administration', name: 'Administration', icon: Building2, description: 'Services administratifs' },
      { id: 'poste', name: 'Bureaux de poste', icon: Mailbox, description: 'Services postaux' },
      { id: 'assurances', name: 'Assurances', icon: CircleDollarSign, description: 'Agences d\'assurance' }
    ]
  },
  {
    id: 'sante',
    name: 'Santé',
    icon: HeartPulse,
    color: '#27ae60',
    subcategories: [
      { id: 'hopitaux', name: 'Hôpitaux', icon: HeartCrack, description: 'Centres hospitaliers' },
      { id: 'cliniques', name: 'Cliniques', icon: Building, description: 'Établissements de santé privés' },
      { id: 'dentistes', name: 'Dentistes', icon: Stethoscope, description: 'Cabinets dentaires' },
      { id: 'medecins', name: 'Médecins généralistes', icon: Stethoscope, description: 'Cabinets médicaux' },
      { id: 'pharmacies_sante', name: 'Pharmacies', icon: Pill, description: 'Pharmacies et parapharmacies' },
      { id: 'laboratoires', name: 'Laboratoires d\'analyses', icon: Flask, description: 'Laboratoires médicaux' },
      { id: 'opticiens_sante', name: 'Opticiens', icon: Eye, description: 'Magasins d\'optique' },
      { id: 'radiologie', name: 'Centres de radiologie', icon: FileImage, description: 'Imagerie médicale' },
      { id: 'psychologues', name: 'Psychologues', icon: Brain, description: 'Cabinets de psychologues' },
      { id: 'veterinaires', name: 'Vétérinaires', icon: PawPrint, description: 'Cliniques vétérinaires' }
    ]
  },
  {
    id: 'divertissement',
    name: 'Divertissement',
    icon: Film,
    color: '#9b59b6',
    subcategories: [
      { id: 'cinemas', name: 'Cinémas', icon: Clapperboard, description: 'Salles de cinéma' },
      { id: 'theatres', name: 'Théâtres', icon: Theater, description: 'Salles de spectacle' },
      { id: 'musees', name: 'Musées', icon: Landmark, description: 'Musées et expositions' },
      { id: 'parcs_attractions', name: 'Parcs d\'attractions', icon: Ticket, description: 'Parcs à thème' },
      { id: 'concerts', name: 'Salles de concert', icon: Music, description: 'Lieux de musique live' },
      { id: 'clubs', name: 'Clubs et discothèques', icon: PartyPopper, description: 'Boîtes de nuit' },
      { id: 'parcs', name: 'Parcs et jardins', icon: Trees, description: 'Espaces verts' },
      { id: 'loisirs', name: 'Centres de loisirs', icon: Blocks, description: 'Activités récréatives' },
      { id: 'bowling', name: 'Bowling', icon: Timer, description: 'Salles de bowling' },
      { id: 'patinoires', name: 'Patinoires', icon: Infinity, description: 'Patinage sur glace' },
      { id: 'piscines', name: 'Piscines', icon: Waves, description: 'Piscines publiques' },
      { id: 'plages', name: 'Plages', icon: Sunrise, description: 'Plages et bords de mer' }
    ]
  },
  {
    id: 'hebergement',
    name: 'Hébergement',
    icon: Hotel,
    color: '#34495e',
    subcategories: [
      { id: 'hotels', name: 'Hôtels', icon: Building, description: 'Établissements hôteliers' },
      { id: 'auberges', name: 'Auberges', icon: Building2, description: 'Auberges de jeunesse' },
      { id: 'chambres', name: 'Chambres d\'hôtes', icon: BedDouble, description: 'Chambres chez l\'habitant' },
      { id: 'camping', name: 'Camping', icon: Tent, description: 'Terrains de camping' },
      { id: 'locations', name: 'Locations de vacances', icon: Home, description: 'Locations saisonnières' }
    ]
  }
];
