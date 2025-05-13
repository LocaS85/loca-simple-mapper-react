
import { toast } from "sonner";
import { useToast as useHookToast } from "@/hooks/use-toast";

// Réexporter pour maintenir la compatibilité
export const useToast = useHookToast;
export { toast };
