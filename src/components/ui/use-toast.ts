
import { toast } from "sonner";
import { useToast as useHookToast } from "@/hooks/use-toast";

// Re-export for compatibility
export const useToast = useHookToast;
export { toast };
