
import { Category, CategoryItem } from "@/types/unified";

export const categories: Category[] = [
  {
    id: 'divertissement',
    name: 'Divertissement',
    icon: '🎬',
    color: '#8e44ad',
    description: 'Cinéma, concerts, théâtres et divertissements',
    subcategories: [
      { id: 'cinema', name: 'Cinéma', icon: '🎬' },
      { id: 'concert', name: 'Concert', icon: '🎵' },
      { id: 'theatre', name: 'Théâtre', icon: '🎭' }
    ]
  },
  {
    id: 'sante',
    name: 'Santé',
    icon: '🧘',
    color: '#27ae60',
    description: 'Pharmacies, cliniques et bien-être',
    subcategories: [
      { id: 'pharmacie', name: 'Pharmacie', icon: '💊' },
      { id: 'clinique', name: 'Clinique', icon: '🏥' },
      { id: 'yoga', name: 'Yoga', icon: '🧘' }
    ]
  },
  {
    id: 'alimentation',
    name: 'Alimentation',
    icon: '🍔',
    color: '#e67e22',
    description: 'Restaurants, cafés et bars',
    subcategories: [
      { id: 'cafe', name: 'Café', icon: '☕' },
      { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
      { id: 'bar', name: 'Bar', icon: '🍻' }
    ]
  },
  {
    id: 'quotidien',
    name: 'Quotidien',
    icon: '📍',
    color: '#3498db',
    description: 'Lieux de vie quotidienne',
    subcategories: [
      { id: 'maison', name: 'Maison', icon: '🏠' },
      { id: 'travail', name: 'Travail', icon: '💼' },
      { id: 'autre', name: 'Autre', icon: '📍' }
    ]
  },
];

export const categoriesData = categories;
