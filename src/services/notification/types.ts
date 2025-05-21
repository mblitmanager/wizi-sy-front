
import { ToastAction } from '@/lib/toast/toast-types';

export type NotificationOptions = {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: any;
};

export type NotificationServiceState = {
  permission: NotificationPermission;
  isSupported: boolean;
  serviceWorkerRegistration: ServiceWorkerRegistration | null;
};
