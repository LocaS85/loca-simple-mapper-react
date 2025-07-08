-- Créer les tables pour la gestion des catégories et adresses

-- Table des catégories principales
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text NOT NULL,
  color text NOT NULL,
  category_type text NOT NULL DEFAULT 'standard', -- 'standard', 'special' (famille, travail, école)
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table des sous-catégories
CREATE TABLE public.subcategories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  icon text NOT NULL,
  search_terms text[], -- Termes de recherche pour Mapbox
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table des modes de transport
CREATE TABLE public.transport_modes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  default_color text NOT NULL, -- Couleur par défaut
  mapbox_profile text NOT NULL, -- 'walking', 'driving', 'cycling', 'transit'
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table des préférences utilisateur pour les couleurs de transport
CREATE TABLE public.user_transport_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  transport_mode_id uuid NOT NULL REFERENCES public.transport_modes(id) ON DELETE CASCADE,
  custom_color text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, transport_mode_id)
);

-- Table des adresses utilisateur
CREATE TABLE public.user_addresses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  category_type text NOT NULL, -- 'main', 'family', 'work', 'school'
  name text NOT NULL, -- Nom personnalisé (ex: "Papa", "Job principal")
  address text NOT NULL,
  coordinates point NOT NULL,
  role text, -- Pour famille: 'père', 'mère', etc. Pour travail: 'principal', 'secondaire'
  company_name text, -- Pour les adresses de travail
  is_primary boolean DEFAULT false, -- Pour l'adresse principale
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_transport_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour categories (lecture publique)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT USING (true);

-- Politiques RLS pour subcategories (lecture publique)
CREATE POLICY "Subcategories are viewable by everyone" 
ON public.subcategories FOR SELECT USING (true);

-- Politiques RLS pour transport_modes (lecture publique)
CREATE POLICY "Transport modes are viewable by everyone" 
ON public.transport_modes FOR SELECT USING (true);

-- Politiques RLS pour user_transport_preferences
CREATE POLICY "Users can view their own transport preferences" 
ON public.user_transport_preferences FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transport preferences" 
ON public.user_transport_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transport preferences" 
ON public.user_transport_preferences FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transport preferences" 
ON public.user_transport_preferences FOR DELETE 
USING (auth.uid() = user_id);

-- Politiques RLS pour user_addresses
CREATE POLICY "Users can view their own addresses" 
ON public.user_addresses FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses" 
ON public.user_addresses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses" 
ON public.user_addresses FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses" 
ON public.user_addresses FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger pour mise à jour automatique des timestamps
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at
  BEFORE UPDATE ON public.subcategories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_transport_preferences_updated_at
  BEFORE UPDATE ON public.user_transport_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at
  BEFORE UPDATE ON public.user_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer les catégories principales
INSERT INTO public.categories (name, description, icon, color, category_type, sort_order) VALUES
('Adresse principale', 'Votre adresse principale pour un accès rapide', '🏠', '#3B82F6', 'special', 1),
('Famille', 'Adresses des membres de la famille', '👨‍👩‍👧‍👦', '#EF4444', 'special', 2),
('Travail', 'Adresses de vos lieux de travail', '💼', '#10B981', 'special', 3),
('École', 'Adresses des établissements scolaires', '🏫', '#F59E0B', 'special', 4),
('Alimentation et Boissons', 'Restaurants, cafés, supermarchés', '🍽️', '#8B5CF6', 'standard', 5),
('Achats', 'Magasins, boutiques, centres commerciaux', '🛍️', '#06B6D4', 'standard', 6),
('Services', 'Services divers et administratifs', '🔧', '#84CC16', 'standard', 7),
('Santé et Bien-être', 'Hôpitaux, cliniques, médecins', '🏥', '#F97316', 'standard', 8),
('Divertissement et Loisirs', 'Cinémas, parcs, centres de loisirs', '🎭', '#EC4899', 'standard', 9),
('Hébergement', 'Hôtels, auberges, campings', '🏨', '#6366F1', 'standard', 10);

-- Insérer les sous-catégories pour Alimentation et Boissons
INSERT INTO public.subcategories (category_id, name, icon, search_terms, sort_order) VALUES
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Restaurants Gastronomiques', '🍽️', ARRAY['restaurant', 'gastronomique', 'fine dining'], 1),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Restaurants Rapides', '🍔', ARRAY['fast food', 'quick service', 'burger'], 2),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Restaurants Végétariens/Végans', '🥗', ARRAY['vegetarian', 'vegan', 'plant based'], 3),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Pizzerias', '🍕', ARRAY['pizza', 'pizzeria', 'italian'], 4),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Restaurants Sushi', '🍣', ARRAY['sushi', 'japanese', 'asian'], 5),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Cuisine du Monde', '🌍', ARRAY['ethnic', 'international', 'world cuisine'], 6),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Bars à Vin', '🍷', ARRAY['wine bar', 'vin', 'caviste'], 7),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Pubs', '🍺', ARRAY['pub', 'bar', 'bière'], 8),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Bars à Cocktails', '🍸', ARRAY['cocktail bar', 'mixology', 'lounge'], 9),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Cafés', '☕', ARRAY['cafe', 'coffee shop', 'espresso'], 10),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Salons de Thé', '🫖', ARRAY['tea house', 'salon de thé', 'tea room'], 11),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Boulangeries', '🥖', ARRAY['bakery', 'boulangerie', 'bread'], 12),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Supermarchés', '🛒', ARRAY['supermarket', 'grocery store', 'hypermarket'], 13),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Vente à Emporter', '🥡', ARRAY['takeaway', 'take out', 'à emporter'], 14),
((SELECT id FROM public.categories WHERE name = 'Alimentation et Boissons'), 'Livraison', '🚚', ARRAY['delivery', 'livraison', 'food delivery'], 15);

-- Insérer les modes de transport avec couleurs par défaut
INSERT INTO public.transport_modes (name, icon, default_color, mapbox_profile, sort_order) VALUES
('Vélo', '🚴', '#EF4444', 'cycling', 1),
('Voiture', '🚗', '#3B82F6', 'driving', 2),
('À pied', '🚶', '#10B981', 'walking', 3),
('Bus', '🚌', '#F59E0B', 'driving', 4),
('Tramway', '🚊', '#F97316', 'driving', 5),
('Métro', '🚇', '#8B5CF6', 'driving', 6),
('Avion', '✈️', '#06B6D4', 'driving', 7),
('Transports en commun', '🚌', '#6B7280', 'driving', 8),
('Cars', '🚐', '#A3A3A3', 'driving', 9),
('Train', '🚆', '#000000', 'driving', 10),
('Aéroport', '🛫', '#8B5CF6', 'driving', 11),
('Aérodrome', '🛩️', '#EC4899', 'driving', 12);

-- Continuer avec les autres catégories...
-- (Achats, Services, Santé, Divertissement, Hébergement)
-- Je vais ajouter quelques exemples pour chaque catégorie

-- Sous-catégories pour Achats
INSERT INTO public.subcategories (category_id, name, icon, search_terms, sort_order) VALUES
((SELECT id FROM public.categories WHERE name = 'Achats'), 'Prêt-à-porter', '👔', ARRAY['clothing store', 'fashion', 'vêtements'], 1),
((SELECT id FROM public.categories WHERE name = 'Achats'), 'Boutiques de Luxe', '💎', ARRAY['luxury', 'designer', 'high end'], 2),
((SELECT id FROM public.categories WHERE name = 'Achats'), 'Magasins de Chaussures', '👟', ARRAY['shoes', 'footwear', 'chaussures'], 3),
((SELECT id FROM public.categories WHERE name = 'Achats'), 'Téléphonie', '📱', ARRAY['phone store', 'mobile', 'telecom'], 4),
((SELECT id FROM public.categories WHERE name = 'Achats'), 'Informatique', '💻', ARRAY['computer store', 'electronics', 'tech'], 5),
((SELECT id FROM public.categories WHERE name = 'Achats'), 'Pharmacies', '💊', ARRAY['pharmacy', 'pharmacie', 'drugstore'], 6),
((SELECT id FROM public.categories WHERE name = 'Achats'), 'Coiffeurs', '💇', ARRAY['hair salon', 'coiffeur', 'barber'], 7),
((SELECT id FROM public.categories WHERE name = 'Achats'), 'Banques et DAB', '🏦', ARRAY['bank', 'atm', 'banque'], 8);

-- Sous-catégories pour Santé et Bien-être
INSERT INTO public.subcategories (category_id, name, icon, search_terms, sort_order) VALUES
((SELECT id FROM public.categories WHERE name = 'Santé et Bien-être'), 'Hôpitaux', '🏥', ARRAY['hospital', 'hôpital', 'emergency'], 1),
((SELECT id FROM public.categories WHERE name = 'Santé et Bien-être'), 'Cliniques', '🏩', ARRAY['clinic', 'medical center', 'clinique'], 2),
((SELECT id FROM public.categories WHERE name = 'Santé et Bien-être'), 'Dentistes', '🦷', ARRAY['dentist', 'dental', 'dentiste'], 3),
((SELECT id FROM public.categories WHERE name = 'Santé et Bien-être'), 'Médecins Généralistes', '👨‍⚕️', ARRAY['doctor', 'general practitioner', 'médecin'], 4),
((SELECT id FROM public.categories WHERE name = 'Santé et Bien-être'), 'Laboratoires', '🧪', ARRAY['laboratory', 'lab tests', 'analyse'], 5),
((SELECT id FROM public.categories WHERE name = 'Santé et Bien-être'), 'Vétérinaires', '🐕', ARRAY['veterinarian', 'animal hospital', 'vétérinaire'], 6);

-- Sous-catégories pour Divertissement et Loisirs
INSERT INTO public.subcategories (category_id, name, icon, search_terms, sort_order) VALUES
((SELECT id FROM public.categories WHERE name = 'Divertissement et Loisirs'), 'Cinémas', '🎬', ARRAY['cinema', 'movie theater', 'film'], 1),
((SELECT id FROM public.categories WHERE name = 'Divertissement et Loisirs'), 'Théâtres', '🎭', ARRAY['theater', 'theatre', 'show'], 2),
((SELECT id FROM public.categories WHERE name = 'Divertissement et Loisirs'), 'Musées', '🏛️', ARRAY['museum', 'gallery', 'art'], 3),
((SELECT id FROM public.categories WHERE name = 'Divertissement et Loisirs'), 'Parcs d''Attractions', '🎡', ARRAY['amusement park', 'theme park', 'rides'], 4),
((SELECT id FROM public.categories WHERE name = 'Divertissement et Loisirs'), 'Parcs et Jardins', '🌳', ARRAY['park', 'garden', 'green space'], 5),
((SELECT id FROM public.categories WHERE name = 'Divertissement et Loisirs'), 'Piscines', '🏊', ARRAY['swimming pool', 'aquatic center', 'piscine'], 6);

-- Sous-catégories pour Hébergement
INSERT INTO public.subcategories (category_id, name, icon, search_terms, sort_order) VALUES
((SELECT id FROM public.categories WHERE name = 'Hébergement'), 'Hôtels', '🏨', ARRAY['hotel', 'accommodation', 'lodging'], 1),
((SELECT id FROM public.categories WHERE name = 'Hébergement'), 'Auberges', '🏠', ARRAY['hostel', 'auberge', 'budget accommodation'], 2),
((SELECT id FROM public.categories WHERE name = 'Hébergement'), 'Chambres d''Hôtes', '🏡', ARRAY['bed and breakfast', 'b&b', 'guest house'], 3),
((SELECT id FROM public.categories WHERE name = 'Hébergement'), 'Camping', '🏕️', ARRAY['camping', 'campsite', 'rv park'], 4),
((SELECT id FROM public.categories WHERE name = 'Hébergement'), 'Locations de Vacances', '🏖️', ARRAY['vacation rental', 'holiday home', 'airbnb'], 5);