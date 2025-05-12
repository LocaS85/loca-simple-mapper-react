
import { 
  Utensils, 
  ShoppingBag, 
  MapPin, 
  Home, 
  Briefcase 
} from "lucide-react";
import { CategoryItem } from "@/types/categories";

export const categories: CategoryItem[] = [
  {
    id: "food",
    name: "Alimentation et Boissons",
    label: "Restaurants",
    icon: "Utensils",
    color: "#e67e22",
  },
  {
    id: "shopping",
    name: "Achats",
    label: "Commerces",
    icon: "ShoppingBag",
    color: "#2ecc71",
  },
  {
    id: "daily",
    name: "Quotidien",
    label: "Lieux quotidiens",
    icon: "MapPin",
    color: "#3498db",
  },
  {
    id: "home",
    name: "Domicile",
    label: "Domicile",
    icon: "Home",
    color: "#9b59b6",
  },
  {
    id: "work",
    name: "Travail",
    label: "Travail",
    icon: "Briefcase",
    color: "#f39c12",
  }
];
