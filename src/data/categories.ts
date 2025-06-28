
import { Category } from "../types/categories";

export const categories: Category[] = [
  {
    id: 'divertissement',
    name: 'Divertissement',
    icon: '🎬',
    color: '#8e44ad',
    description: 'Cinéma, concerts, théâtres et divertissements',
    subcategories: ['cinema', 'concert', 'theatre']
  },
  {
    id: 'sante',
    name: 'Santé',
    icon: '🧘',
    color: '#27ae60',
    description: 'Pharmacies, cliniques et bien-être',
    subcategories: ['pharmacie', 'clinique', 'yoga']
  },
  {
    id: 'alimentation',
    name: 'Alimentation',
    icon: '🍔',
    color: '#e67e22',
    description: 'Restaurants, cafés et bars',
    subcategories: ['cafe', 'restaurant', 'bar']
  },
  {
    id: 'quotidien',
    name: 'Quotidien',
    icon: '📍',
    color: '#3498db',
    description: 'Lieux de vie quotidienne',
    subcategories: ['maison', 'travail', 'autre']
  },
];

export const categoriesData = categories;
