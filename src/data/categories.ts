
import { Category, Subcategory } from "../types";

export const categoriesData: Category[] = [
  {
    id: 'divertissement',
    name: 'Divertissement',
    icon: '🎬',
    color: '#8e44ad',
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
    subcategories: [
      { id: 'cafe', name: 'Café', icon: '☕' },
      { id: 'restaurant', name: 'Restaurant', icon: '🍴' },
      { id: 'bar', name: 'Bar', icon: '🍻' }
    ]
  },
];
