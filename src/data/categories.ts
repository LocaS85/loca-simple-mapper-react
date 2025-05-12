
import { CategoryItem } from "../types/category";

export const categoriesData: CategoryItem[] = [
  {
    id: 'quotidien',
    name: 'Quotidien',
    icon: '🕒',
    color: '#4299e1',
    subcategories: [
      { id: 'adresse-principale', name: 'Adresse principale', description: 'Votre adresse de domicile', icon: '🏠' },
      { id: 'famille', name: 'Famille', description: 'Adresses des membres de votre famille', icon: '👪' },
      { id: 'amis', name: 'Amis', description: 'Adresses de vos amis', icon: '👥' },
      { id: 'travail', name: 'Travail', description: 'Adresse de votre lieu de travail', icon: '💼' },
      { id: 'ecole', name: 'École', description: 'Adresses des établissements scolaires', icon: '🏫' },
      { id: 'autre', name: 'Autre', description: 'Autres adresses personnalisables', icon: '📍' }
    ]
  },
  {
    id: 'alimentation',
    name: 'Alimentation',
    icon: '🍽️',
    color: '#f56565',
    subcategories: [
      { id: 'restaurants', name: 'Restaurants', description: 'Gastronomie, Rapide, Végétariens, Pizza, Sushi, etc.', icon: '🍴' },
      { id: 'bars', name: 'Bars', description: 'Bars à vin, Pubs, Bars à cocktails', icon: '🍸' },
      { id: 'cafes', name: 'Cafés et Salons de thé', description: 'Cafés, Salons de thé', icon: '☕' },
      { id: 'boulangeries', name: 'Boulangeries', description: 'Boulangeries et pâtisseries', icon: '🥐' },
      { id: 'supermarches', name: 'Supermarchés', description: 'Grandes surfaces et épiceries', icon: '🛒' },
      { id: 'emporter', name: 'Vente à emporter', description: 'Plats à emporter', icon: '🥡' },
      { id: 'livraison', name: 'Livraison', description: 'Services de livraison de repas', icon: '🛵' }
    ]
  },
  {
    id: 'achats',
    name: 'Achats',
    icon: '🛍️',
    color: '#ed8936',
    subcategories: [
      { id: 'vetements', name: 'Magasins de vêtements', description: 'Prêt-à-porter, Boutiques de luxe, Chaussures', icon: '👕' },
      { id: 'electronique', name: 'Magasins d\'électronique', description: 'Téléphonie, Informatique, Électroménager', icon: '📱' },
      { id: 'bibliotheques', name: 'Bibliothèques', description: 'Généralistes, Spécialisées, D\'occasion', icon: '📚' },
      { id: 'jouets', name: 'Magasins de jouets', description: 'Jouets et jeux', icon: '🧸' },
      { id: 'pharmacies', name: 'Pharmacies', description: 'Médicaments et produits de santé', icon: '💊' },
      { id: 'parfumeries', name: 'Parfumeries', description: 'Parfums et cosmétiques', icon: '🧴' },
      { id: 'bijouteries', name: 'Bijouteries', description: 'Bijoux et accessoires', icon: '💍' },
      { id: 'opticiens', name: 'Opticiens', description: 'Lunettes et lentilles', icon: '👓' },
      { id: 'sport', name: 'Magasins de sport', description: 'Équipements et vêtements de sport', icon: '🏀' },
      { id: 'fleuristes', name: 'Fleuristes', description: 'Fleurs et plantes', icon: '💐' }
    ]
  },
  {
    id: 'services',
    name: 'Services',
    icon: '🔧',
    color: '#38b2ac',
    subcategories: [
      { id: 'coiffeurs', name: 'Coiffeurs', description: 'Hommes, Femmes, Barbiers', icon: '💇' },
      { id: 'beaute', name: 'Beauté', description: 'Salon de beauté, Esthétique, Ongleries, Spa', icon: '💆' },
      { id: 'pressing', name: 'Pressing', description: 'Nettoyage à sec et blanchisserie', icon: '👔' },
      { id: 'automobile', name: 'Automobile', description: 'Lavage, Réparation, Parking, Stations-service', icon: '🚗' },
      { id: 'banques', name: 'Banques et DAB', description: 'Agences bancaires et distributeurs', icon: '🏦' }
    ]
  },
  {
    id: 'sante',
    name: 'Santé et Bien-être',
    icon: '⚕️',
    color: '#48bb78',
    subcategories: [
      { id: 'hopitaux', name: 'Hôpitaux', description: 'Centres hospitaliers', icon: '🏥' },
      { id: 'cliniques', name: 'Cliniques', description: 'Cliniques privées', icon: '🏨' },
      { id: 'dentistes', name: 'Dentistes', description: 'Cabinets dentaires', icon: '🦷' },
      { id: 'medecins', name: 'Médecins généralistes', description: 'Cabinets de médecine générale', icon: '👨‍⚕️' },
      { id: 'pharmacies-sante', name: 'Pharmacies', description: 'Médicaments et produits de santé', icon: '💊' },
      { id: 'laboratoires', name: 'Laboratoires d\'analyses', description: 'Prises de sang et analyses médicales', icon: '🧪' },
      { id: 'opticiens-sante', name: 'Opticiens', description: 'Lunettes et lentilles', icon: '👓' },
      { id: 'radiologie', name: 'Centres de radiologie', description: 'Imagerie médicale', icon: '📷' },
      { id: 'psychologues', name: 'Psychologues', description: 'Professionnels de la santé mentale', icon: '🧠' },
      { id: 'veterinaires', name: 'Vétérinaires', description: 'Soins pour animaux', icon: '🐾' }
    ]
  },
  {
    id: 'divertissement',
    name: 'Divertissement',
    icon: '🎭',
    color: '#9f7aea',
    subcategories: [
      { id: 'cinemas', name: 'Cinémas', description: 'Salles de projection', icon: '🎬' },
      { id: 'theatres', name: 'Théâtres', description: 'Salles de spectacles', icon: '🎭' },
      { id: 'musees', name: 'Musées', description: 'Expositions et collections', icon: '🏛️' },
      { id: 'parcs-attractions', name: 'Parcs d\'attractions', description: 'Divertissement et aventure', icon: '🎡' },
      { id: 'concerts', name: 'Salles de concert', description: 'Événements musicaux', icon: '🎵' },
      { id: 'clubs', name: 'Clubs et discothèques', description: 'Vie nocturne', icon: '💃' },
      { id: 'parcs', name: 'Parcs et jardins', description: 'Espaces verts', icon: '🌳' },
      { id: 'loisirs', name: 'Centres de loisirs', description: 'Activités diverses', icon: '🎯' },
      { id: 'bowling', name: 'Bowling', description: 'Pistes de bowling', icon: '🎳' },
      { id: 'patinoires', name: 'Patinoires', description: 'Patinage sur glace', icon: '⛸️' },
      { id: 'piscines', name: 'Piscines', description: 'Natation et aquagym', icon: '🏊' },
      { id: 'plages', name: 'Plages', description: 'Bord de mer', icon: '🏖️' }
    ]
  },
  {
    id: 'hebergement',
    name: 'Hébergement',
    icon: '🏨',
    color: '#d69e2e',
    subcategories: [
      { id: 'hotels', name: 'Hôtels', description: 'Établissements hôteliers', icon: '🏨' },
      { id: 'auberges', name: 'Auberges', description: 'Auberges de jeunesse et hostels', icon: '🏠' },
      { id: 'chambres', name: 'Chambres d\'hôtes', description: 'Hébergement chez l\'habitant', icon: '🛏️' },
      { id: 'camping', name: 'Camping', description: 'Emplacements et bungalows', icon: '⛺' },
      { id: 'locations', name: 'Locations de vacances', description: 'Appartements et maisons à louer', icon: '🏡' }
    ]
  }
];
