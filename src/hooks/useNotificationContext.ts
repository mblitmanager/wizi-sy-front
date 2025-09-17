import { useContext } from 'react';
import { NotificationContext } from '@/context/NotificationProvider';

export function useNotificationContext() {
  const ctx = useContext(NotificationContext as any);
  if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider');
  return ctx as any;
}

export default useNotificationContext;
