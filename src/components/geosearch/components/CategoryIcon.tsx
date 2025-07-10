import React from 'react';
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
  Book
} from 'lucide-react';

interface CategoryIconProps {
  iconName: string;
  className?: string;
  size?: number;
  color?: string;
}

const iconMap = {
  'Utensils': Utensils,
  'ShoppingBag': ShoppingBag,
  'Heart': Heart,
  'GraduationCap': GraduationCap,
  'Car': Car,
  'Gamepad2': Gamepad2,
  'Briefcase': Briefcase,
  'MapPin': MapPin,
  'Home': Home,
  'Scissors': Scissors,
  'Dumbbell': Dumbbell,
  'Plane': Plane,
  'Building': Building,
  'Music': Music,
  'Baby': Baby,
  'Wrench': Wrench,
  'PiggyBank': PiggyBank,
  'TreePine': TreePine,
  'Camera': Camera,
  'Users': Users,
  'Coffee': Coffee,
  'Hotel': Hotel,
  'Fuel': Fuel,
  'Hospital': Hospital,
  'Phone': Phone,
  'ShoppingCart': ShoppingCart,
  'Package': Package,
  'Clock': Clock,
  'Palette': Palette,
  'Book': Book
};

const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  className = 'w-4 h-4',
  size = 16,
  color = 'currentColor'
}) => {
  const IconComponent = iconMap[iconName as keyof typeof iconMap] || MapPin;

  return (
    <IconComponent 
      className={className}
      size={size}
      color={color}
    />
  );
};

export default CategoryIcon;