
import { dispatch, actionTypes, genId } from "./toast-store";
import { ToasterToast } from "./toast-types";

// Create a standard toast
export function showToast({
  title, 
  description, 
  variant = "default",
  action,
  duration
}: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactElement;
  duration?: number;
}): ToasterToast {
  const id = genId();
  const toast = { title, description, variant, action, id, open: true, duration };
  dispatch({ type: actionTypes.ADD_TOAST, toast });
  return toast;
}

// Export an object called 'toast' with common methods
export const toast = {
  // Basic toast methods
  success: (message: string, options?: Partial<ToasterToast>) => {
    const id = genId();
    const toast = { 
      title: "Success", 
      description: message,
      variant: "default", 
      id, 
      open: true,
      ...options
    };
    dispatch({ type: actionTypes.ADD_TOAST, toast });
    return toast;
  },
  error: (message: string, options?: Partial<ToasterToast>) => {
    const id = genId();
    const toast = { 
      title: "Error", 
      description: message,
      variant: "destructive", 
      id, 
      open: true,
      ...options
    };
    dispatch({ type: actionTypes.ADD_TOAST, toast });
    return toast;
  },
  info: (message: string, options?: Partial<ToasterToast>) => {
    const id = genId();
    const toast = { 
      title: "Information", 
      description: message,
      variant: "default", 
      id, 
      open: true,
      ...options
    };
    dispatch({ type: actionTypes.ADD_TOAST, toast });
    return toast;
  },
  warning: (message: string, options?: Partial<ToasterToast>) => {
    const id = genId();
    const toast = { 
      title: "Warning", 
      description: message,
      variant: "destructive", 
      id, 
      open: true,
      ...options
    };
    dispatch({ type: actionTypes.ADD_TOAST, toast });
    return toast;
  },
  // Allow creating a custom toast directly
  custom: (props: Omit<ToasterToast, "id" | "open">) => {
    const id = genId();
    const toast = { ...props, id, open: true };
    dispatch({ type: actionTypes.ADD_TOAST, toast });
    return toast;
  },
  // Method to dismiss a specific toast or all toasts
  dismiss: (toastId?: string) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
  }
};
