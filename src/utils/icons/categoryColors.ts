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