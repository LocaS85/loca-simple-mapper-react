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
  Users, 
  Coffee, 
  Hotel, 
  Fuel, 
  Hospital, 
  Phone, 
  ShoppingCart, 
  Package, 
  Clock,
  Palette,
  Book,
  Pizza,
  Wine,
  Shirt,
  Footprints,
  Stethoscope,
  Bus,
  Bike,
  PersonStanding,
  School,
  Factory,
  Landmark,
  LucideIcon
} from 'lucide-react';

// Service unifié pour la gestion des icônes de catégories et sous-catégories
export class CategoryIconService {
  // Mapping principal des catégories Supabase vers icônes Lucide
  private static categoryIconMap: Record<string, LucideIcon> = {
    // Catégories principales
    'alimentation': Utensils,
    'restaurants': Utensils,
    'shopping': ShoppingBag,
    'achats': ShoppingBag,
    'sante': Heart,
    'health': Heart,
    'education': GraduationCap,
    'transport': Car,
    'divertissement': Gamepad2,
    'services': Briefcase,
    'domicile': Home,
    'home': Home,
    'beaute': Scissors,
    'fitness': Dumbbell,
    'voyage': Plane,
    'immobilier': Building,
    'culture': Music,
    'enfants': Baby,
    'reparation': Wrench,
    'finance': PiggyBank,
    'nature': TreePine,
    'photo': Camera,
    'social': Users,
    'bureau': Briefcase,
    'travail': Briefcase,

    // Sous-catégories spécifiques
    'restaurants_gastronomiques': Utensils,
    'fast_food': Pizza,
    'bars_cafes': Coffee,
    'bars': Wine,
    'magasins_vetements': Shirt,
    'chaussures': Footprints,
    'pharmacies': Stethoscope,
    'hopitaux': Hospital,
    'cliniques': Hospital,
    'medecins': Stethoscope,
    'transport_public': Bus,
    'velo': Bike,
    'marche': PersonStanding,
    'ecoles': School,
    'universites': GraduationCap,
    'entreprises': Factory,
    'administrations': Landmark,
    'hotels': Hotel,
    'stations_essence': Fuel,
    'telecommunications': Phone,
    'livraison': Package,
    'horaires': Clock,
    'art': Palette,
    'librairies': Book,
  };

  // Mapping par mots-clés pour une recherche flexible
  private static keywordIconMap: Record<string, LucideIcon> = {
    'restaurant': Utensils,
    'magasin': ShoppingBag,
    'shop': ShoppingBag,
    'hopital': Hospital,
    'pharmacie': Stethoscope,
    'ecole': School,
    'voiture': Car,
    'transport': Bus,
    'hotel': Hotel,
    'bar': Wine,
    'cafe': Coffee,
    'vetement': Shirt,
    'bureau': Briefcase,
    'maison': Home,
    'fitness': Dumbbell,
    'sport': Dumbbell,
    'beaute': Scissors,
    'banque': PiggyBank,
    'finance': PiggyBank,
  };

  /**
   * Obtient l'icône correspondante à une catégorie ou sous-catégorie
   * @param name - Nom de la catégorie/sous-catégorie
   * @param fallbackIcon - Icône de fallback optionnelle
   * @returns Component d'icône Lucide React
   */
  static getIcon(name: string, fallbackIcon?: LucideIcon): LucideIcon {
    if (!name) return fallbackIcon || MapPin;

    const normalizedName = name.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[éèê]/g, 'e')
      .replace(/[àâ]/g, 'a')
      .replace(/[ùû]/g, 'u')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/ç/g, 'c');

    // Recherche exacte dans le mapping principal
    if (this.categoryIconMap[normalizedName]) {
      return this.categoryIconMap[normalizedName];
    }

    // Recherche par mots-clés
    for (const [keyword, icon] of Object.entries(this.keywordIconMap)) {
      if (normalizedName.includes(keyword)) {
        return icon;
      }
    }

    // Fallback vers l'icône fournie ou MapPin par défaut
    return fallbackIcon || MapPin;
  }

  /**
   * Obtient l'icône d'une catégorie Supabase
   * @param category - Objet catégorie avec propriété 'name' et optionnellement 'icon'
   * @returns Component d'icône Lucide React
   */
  static getCategoryIcon(category: { name: string; icon?: string }): LucideIcon {
    // Si la catégorie a une icône spécifiée, essayer de l'utiliser
    if (category.icon && this.categoryIconMap[category.icon.toLowerCase()]) {
      return this.categoryIconMap[category.icon.toLowerCase()];
    }
    
    return this.getIcon(category.name);
  }

  /**
   * Obtient l'icône d'une sous-catégorie Supabase
   * @param subcategory - Objet sous-catégorie
   * @param parentCategory - Catégorie parente optionnelle pour fallback
   * @returns Component d'icône Lucide React
   */
  static getSubcategoryIcon(
    subcategory: { name: string; icon?: string }, 
    parentCategory?: { name: string; icon?: string }
  ): LucideIcon {
    // Priorité à l'icône spécifiée de la sous-catégorie
    if (subcategory.icon && this.categoryIconMap[subcategory.icon.toLowerCase()]) {
      return this.categoryIconMap[subcategory.icon.toLowerCase()];
    }

    // Recherche par nom de sous-catégorie
    const subcatIcon = this.getIcon(subcategory.name);
    if (subcatIcon !== MapPin) {
      return subcatIcon;
    }

    // Fallback vers l'icône de la catégorie parente
    if (parentCategory) {
      return this.getCategoryIcon(parentCategory);
    }

    return MapPin;
  }

  /**
   * Obtient toutes les icônes disponibles pour le mapping
   * @returns Record avec nom → composant d'icône
   */
  static getAllIcons(): Record<string, LucideIcon> {
    return { ...this.categoryIconMap };
  }
}

export default CategoryIconService;