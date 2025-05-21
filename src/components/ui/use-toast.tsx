
// Re-export from the actual component implementation
import {
  useToast,
  toast,
  showToast
} from "@/hooks/use-toast";

import type { ToastAction, ToasterToast } from "@/lib/toast/toast-types";

import {
  type ToastActionElement,
  type ToastProps 
} from "@/components/ui/toast";

export {
  useToast,
  toast,
  showToast
};

export type {
  ToastAction,
  ToasterToast,
  ToastActionElement,
  ToastProps
};
