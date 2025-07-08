-- Ajouter support pour les catégories d'adresses personnalisables
ALTER TABLE user_addresses ADD COLUMN custom_category_name TEXT;
ALTER TABLE user_addresses ADD COLUMN custom_category_icon TEXT DEFAULT '📍';
ALTER TABLE user_addresses ADD COLUMN custom_category_color TEXT DEFAULT '#6366f1';

-- Mettre à jour les contraintes pour permettre les catégories personnalisées
ALTER TABLE user_addresses ALTER COLUMN category_type DROP NOT NULL;

-- Ajouter une contrainte pour s'assurer qu'au moins category_type ou custom_category_name est défini
ALTER TABLE user_addresses ADD CONSTRAINT check_category_defined 
CHECK (
  (category_type IS NOT NULL) OR 
  (custom_category_name IS NOT NULL AND custom_category_name != '')
);