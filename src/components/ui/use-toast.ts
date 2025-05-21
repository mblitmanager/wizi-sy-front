
// Re-export from the main toast implementation
import { useToast, toast, showToast } from "@/hooks/use-toast";
import type { ToastAction, ToasterToast } from "@/lib/toast/toast-types";

export { 
  useToast, 
  toast, 
  showToast 
};

export type { 
  ToastAction,
  ToasterToast
};
