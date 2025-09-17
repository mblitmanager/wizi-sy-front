import { useNotificationContext } from '@/context/NotificationProvider';

export function useNotifications() {
  return useNotificationContext();
}

export default useNotifications;
