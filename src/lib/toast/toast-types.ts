
import { type ReactNode } from "react";

export type ToastActionElement = React.ReactElement<any, string | React.JSXElementConstructor<any>>;

export interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  duration?: number;
  open: boolean;
}

export type ToasterToast = ToastProps;

export type ToastAction = {
  label: string;
  onClick: () => void;
  className?: string;
};
