export interface FullSubcategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  mapboxCategory?: string;
  keywords?: string[];
  maxDistance?: number;
}

export interface FullCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories: FullSubcategory[];
  maxDistance?: number;
}

export const fullCategories: FullCategory[] = [
  {
    id: 'restaurant',
    name: 'Restaurants',
    icon: 'utensils',
    color: '#ef4444',
    maxDistance: Number.POSITIVE_INFINITY, // Utilise Number.POSITIVE_INFINITY au lieu de Infinity
    subcategories: [
      {
        id: 'italian',
        name: 'Italien',
        icon: 'pizza-slice',
        mapboxCategory: 'restaurant.italian',
        keywords: ['pizza', 'pasta', 'risotto'],
        maxDistance: 5
      },
      {
        id: 'french',
        name: 'Français',
        icon: 'croissant',
        mapboxCategory: 'restaurant.french',
        keywords: ['bistro', 'wine', 'steak'],
        maxDistance: 5
      },
      {
        id: 'japanese',
        name: 'Japonais',
        icon: 'sushi',
        mapboxCategory: 'restaurant.japanese',
        keywords: ['sushi', 'ramen', 'sake'],
        maxDistance: 5
      },
      {
        id: 'chinese',
        name: 'Chinois',
        icon: 'noodles',
        mapboxCategory: 'restaurant.chinese',
        keywords: ['dumplings', 'noodles', 'tea'],
        maxDistance: 5
      },
      {
        id: 'indian',
        name: 'Indien',
        icon: 'curry',
        mapboxCategory: 'restaurant.indian',
        keywords: ['curry', 'naan', 'tandoori'],
        maxDistance: 5
      },
      {
        id: 'burger',
        name: 'Burger',
        icon: 'hamburger',
        mapboxCategory: 'restaurant.burger',
        keywords: ['burger', 'fries', 'milkshake'],
        maxDistance: 3
      },
      {
        id: 'pizza',
        name: 'Pizza',
        icon: 'pizza-slice',
        mapboxCategory: 'restaurant.pizza',
        keywords: ['pizza', 'pasta', 'italian'],
        maxDistance: 3
      },
      {
        id: 'vegetarian',
        name: 'Végétarien',
        icon: 'leaf',
        mapboxCategory: 'restaurant.vegetarian',
        keywords: ['vegetarian', 'vegan', 'salad'],
        maxDistance: 5
      },
      {
        id: 'fast_food',
        name: 'Fast Food',
        icon: 'hotdog',
        mapboxCategory: 'restaurant.fast_food',
        keywords: ['fast food', 'takeaway', 'drive-through'],
        maxDistance: 2
      },
      {
        id: 'seafood',
        name: 'Fruits de mer',
        icon: 'fish',
        mapboxCategory: 'restaurant.seafood',
        keywords: ['seafood', 'fish', 'oysters'],
        maxDistance: 5
      }
    ]
  },
  {
    id: 'hotel',
    name: 'Hôtels',
    icon: 'hotel',
    color: '#3b82f6',
    maxDistance: 20,
    subcategories: [
      {
        id: 'hotel',
        name: 'Hôtel',
        icon: 'bed',
        mapboxCategory: 'accommodation.hotel',
        keywords: ['hotel', 'room', 'bed'],
        maxDistance: 10
      },
      {
        id: 'motel',
        name: 'Motel',
        icon: 'car',
        mapboxCategory: 'accommodation.motel',
        keywords: ['motel', 'roadside', 'parking'],
        maxDistance: 10
      },
      {
        id: 'hostel',
        name: 'Auberge',
        icon: 'users',
        mapboxCategory: 'accommodation.hostel',
        keywords: ['hostel', 'dorm', 'backpackers'],
        maxDistance: 10
      },
      {
        id: 'resort',
        name: 'Complexe hôtelier',
        icon: 'sun',
        mapboxCategory: 'accommodation.resort',
        keywords: ['resort', 'pool', 'beach'],
        maxDistance: 20
      },
      {
        id: 'bed_and_breakfast',
        name: 'Chambre d\'hôtes',
        icon: 'coffee',
        mapboxCategory: 'accommodation.bed_and_breakfast',
        keywords: ['bed and breakfast', 'bnb', 'breakfast'],
        maxDistance: 10
      }
    ]
  },
  {
    id: 'cafe',
    name: 'Cafés',
    icon: 'coffee',
    color: '#f59e0b',
    maxDistance: 5,
    subcategories: [
      {
        id: 'cafe',
        name: 'Café',
        icon: 'mug-hot',
        mapboxCategory: 'cafe',
        keywords: ['coffee', 'tea', 'pastries'],
        maxDistance: 3
      },
      {
        id: 'tea_house',
        name: 'Salon de thé',
        icon: 'tea',
        mapboxCategory: 'cafe.tea_house',
        keywords: ['tea', 'cakes', 'sandwiches'],
        maxDistance: 3
      },
      {
        id: 'internet_cafe',
        name: 'Cybercafé',
        icon: 'wifi',
        mapboxCategory: 'cafe.internet_cafe',
        keywords: ['internet', 'computers', 'coffee'],
        maxDistance: 2
      },
      {
        id: 'juice_bar',
        name: 'Bar à jus',
        icon: 'lemon',
        mapboxCategory: 'cafe.juice_bar',
        keywords: ['juice', 'smoothies', 'healthy'],
        maxDistance: 3
      }
    ]
  },
  {
    id: 'bar',
    name: 'Bars',
    icon: 'beer',
    color: '#10b981',
    maxDistance: 3,
    subcategories: [
      {
        id: 'bar',
        name: 'Bar',
        icon: 'glass-cheers',
        mapboxCategory: 'bar',
        keywords: ['drinks', 'cocktails', 'beer'],
        maxDistance: 2
      },
      {
        id: 'pub',
        name: 'Pub',
        icon: 'beer',
        mapboxCategory: 'bar.pub',
        keywords: ['beer', 'ale', 'snacks'],
        maxDistance: 2
      },
      {
        id: 'sports_bar',
        name: 'Bar des sports',
        icon: 'football',
        mapboxCategory: 'bar.sports_bar',
        keywords: ['sports', 'tv', 'beer'],
        maxDistance: 2
      },
      {
        id: 'nightclub',
        name: 'Discothèque',
        icon: 'music',
        mapboxCategory: 'bar.nightclub',
        keywords: ['dance', 'music', 'dj'],
        maxDistance: 2
      },
      {
        id: 'wine_bar',
        name: 'Bar à vin',
        icon: 'wine-glass',
        mapboxCategory: 'bar.wine_bar',
        keywords: ['wine', 'cheese', 'tapas'],
        maxDistance: 2
      }
    ]
  },
  {
    id: 'store',
    name: 'Magasins',
    icon: 'shopping-bag',
    color: '#8b5cf6',
    maxDistance: 10,
    subcategories: [
      {
        id: 'supermarket',
        name: 'Supermarché',
        icon: 'shopping-cart',
        mapboxCategory: 'store.supermarket',
        keywords: ['groceries', 'food', 'household'],
        maxDistance: 5
      },
      {
        id: 'convenience',
        name: 'Épicerie',
        icon: 'basket',
        mapboxCategory: 'store.convenience',
        keywords: ['snacks', 'drinks', 'essentials'],
        maxDistance: 3
      },
      {
        id: 'bookstore',
        name: 'Librairie',
        icon: 'book',
        mapboxCategory: 'store.bookstore',
        keywords: ['books', 'magazines', 'stationery'],
        maxDistance: 5
      },
      {
        id: 'clothing',
        name: 'Vêtements',
        icon: 't-shirt',
        mapboxCategory: 'store.clothing',
        keywords: ['clothes', 'fashion', 'apparel'],
        maxDistance: 5
      },
      {
        id: 'electronics',
        name: 'Électronique',
        icon: 'tv',
        mapboxCategory: 'store.electronics',
        keywords: ['electronics', 'gadgets', 'devices'],
        maxDistance: 5
      }
    ]
  },
  {
    id: 'bank',
    name: 'Banques',
    icon: 'bank',
    color: '#06b6d4',
    maxDistance: 5,
    subcategories: [
      {
        id: 'bank',
        name: 'Banque',
        icon: 'dollar-sign',
        mapboxCategory: 'bank',
        keywords: ['money', 'atm', 'loans'],
        maxDistance: 3
      },
      {
        id: 'atm',
        name: 'Distributeur',
        icon: 'money',
        mapboxCategory: 'bank.atm',
        keywords: ['cash', 'withdrawal', 'deposit'],
        maxDistance: 2
      },
      {
        id: 'currency_exchange',
        name: 'Bureau de change',
        icon: 'exchange',
        mapboxCategory: 'bank.currency_exchange',
        keywords: ['currency', 'exchange', 'foreign'],
        maxDistance: 3
      }
    ]
  },
  {
    id: 'hospital',
    name: 'Hôpitaux',
    icon: 'hospital',
    color: '#dc2626',
    maxDistance: 15,
    subcategories: [
      {
        id: 'hospital',
        name: 'Hôpital',
        icon: 'plus-square',
        mapboxCategory: 'hospital',
        keywords: ['emergency', 'medical', 'care'],
        maxDistance: 10
      },
      {
        id: 'clinic',
        name: 'Clinique',
        icon: 'stethoscope',
        mapboxCategory: 'hospital.clinic',
        keywords: ['doctor', 'appointment', 'checkup'],
        maxDistance: 5
      },
      {
        id: 'pharmacy',
        name: 'Pharmacie',
        icon: 'pills',
        mapboxCategory: 'hospital.pharmacy',
        keywords: ['medication', 'prescription', 'drugs'],
        maxDistance: 3
      },
      {
        id: 'dentist',
        name: 'Dentiste',
        icon: 'tooth',
        mapboxCategory: 'hospital.dentist',
        keywords: ['teeth', 'cleaning', 'checkup'],
        maxDistance: 5
      }
    ]
  },
  {
    id: 'school',
    name: 'Écoles',
    icon: 'school',
    color: '#6b7280',
    maxDistance: 10,
    subcategories: [
      {
        id: 'primary',
        name: 'Primaire',
        icon: 'graduation-cap',
        mapboxCategory: 'school.primary',
        keywords: ['education', 'children', 'learning'],
        maxDistance: 5
      },
      {
        id: 'secondary',
        name: 'Secondaire',
        icon: 'book-open',
        mapboxCategory: 'school.secondary',
        keywords: ['high school', 'teens', 'studies'],
        maxDistance: 5
      },
      {
        id: 'university',
        name: 'Université',
        icon: 'book',
        mapboxCategory: 'school.university',
        keywords: ['college', 'higher education', 'degrees'],
        maxDistance: 10
      },
      {
        id: 'library',
        name: 'Bibliothèque',
        icon: 'library',
        mapboxCategory: 'school.library',
        keywords: ['books', 'reading', 'research'],
        maxDistance: 5
      }
    ]
  },
  {
    id: 'park',
    name: 'Parcs',
    icon: 'tree',
    color: '#16a34a',
    maxDistance: 5,
    subcategories: [
      {
        id: 'park',
        name: 'Parc',
        icon: 'tree-deciduous',
        mapboxCategory: 'park',
        keywords: ['nature', 'outdoors', 'recreation'],
        maxDistance: 3
      },
      {
        id: 'playground',
        name: 'Aire de jeux',
        icon: 'sliders',
        mapboxCategory: 'park.playground',
        keywords: ['kids', 'play', 'equipment'],
        maxDistance: 2
      },
      {
        id: 'garden',
        name: 'Jardin',
        icon: 'flower',
        mapboxCategory: 'park.garden',
        keywords: ['plants', 'flowers', 'peaceful'],
        maxDistance: 3
      },
      {
        id: 'dog_park',
        name: 'Parc à chiens',
        icon: 'dog',
        mapboxCategory: 'park.dog_park',
        keywords: ['dogs', 'pets', 'exercise'],
        maxDistance: 3
      }
    ]
  },
  {
    id: 'tourism',
    name: 'Tourisme',
    icon: 'camera',
    color: '#9ca3af',
    maxDistance: 20,
    subcategories: [
      {
        id: 'museum',
        name: 'Musée',
        icon: 'landmark',
        mapboxCategory: 'tourism.museum',
        keywords: ['art', 'history', 'culture'],
        maxDistance: 10
      },
      {
        id: 'attraction',
        name: 'Attraction',
        icon: 'star',
        mapboxCategory: 'tourism.attraction',
        keywords: ['sightseeing', 'landmark', 'interest'],
        maxDistance: 10
      },
      {
        id: 'gallery',
        name: 'Galerie',
        icon: 'image',
        mapboxCategory: 'tourism.gallery',
        keywords: ['art', 'exhibition', 'paintings'],
        maxDistance: 5
      },
      {
        id: 'zoo',
        name: 'Zoo',
        icon: 'paw',
        mapboxCategory: 'tourism.zoo',
        keywords: ['animals', 'wildlife', 'conservation'],
        maxDistance: 15
      },
      {
        id: 'aquarium',
        name: 'Aquarium',
        icon: 'water',
        mapboxCategory: 'tourism.aquarium',
        keywords: ['fish', 'marine life', 'exhibits'],
        maxDistance: 15
      }
    ]
  }
];
