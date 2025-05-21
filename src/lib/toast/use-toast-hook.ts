
import * as React from "react";
import { ToasterToast } from "./toast-types";
import { State, subscribe, dispatch, actionTypes, genId } from "./toast-store";

export function useToast() {
  const [state, setState] = React.useState<State>({ toasts: [] });

  React.useEffect(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    toasts: state.toasts,
    toast: (props: Omit<ToasterToast, "id" | "open">) => {
      const id = genId();
      const toast = { ...props, id, open: true };
      dispatch({ type: actionTypes.ADD_TOAST, toast });
      return toast;
    },
    dismiss: (toastId?: string) => {
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId });
    },
  };
}
