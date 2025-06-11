
export interface CategoryData {
  id: string;
  name: string;
  icon: string;
  subcategories?: string[];
}

export const fullCategories: CategoryData[] = [
  {
    id: 'restaurant',
    name: 'Restaurants',
    icon: '🍽️',
    subcategories: ['fast-food', 'gastronomie', 'pizzeria']
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    subcategories: ['supermarche', 'vetements', 'electronique']
  },
  {
    id: 'health',
    name: 'Santé',
    icon: '🏥',
    subcategories: ['pharmacie', 'hopital', 'medecin']
  },
  {
    id: 'education',
    name: 'Éducation',
    icon: '🎓',
    subcategories: ['ecole', 'universite', 'bibliotheque']
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: '🚌',
    subcategories: ['metro', 'bus', 'taxi']
  }
];

export const fullCategoriesData = fullCategories;
