import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { notificationService, Notification as ServiceNotification } from '@/services/NotificationService';

export interface AppNotification extends ServiceNotification {
  // keep extensible shape for UI
  data?: Record<string, any>;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
  pushLocal: (n: Partial<AppNotification>) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const refresh = useCallback(async () => {
    try {
      const list = await notificationService.getNotifications();
      // normalize data shape if needed
      const normalized: AppNotification[] = (list || []).map((n: any) => ({
        id: String(n.id || n._id || n.uuid || n.key || Date.now()),
        message: n.message || n.body || n.title || '',
        timestamp: n.timestamp || n.created_at || Date.now(),
        read: !!n.read,
        type: n.type || 'system',
        data: n.data || n.payload || {},
      }));
      setNotifications(normalized);
      // try to get unread count from API if available
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(Number(count) || normalized.filter(n => !n.read).length);
      } catch (e) {
        setUnreadCount(normalized.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Failed to refresh notifications:', err);
    }
  }, []);

  useEffect(() => {
    // initial load
    refresh();
  }, [refresh]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {
      console.error('markAsRead failed', err);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('markAllAsRead failed', err);
      throw err;
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('remove notification failed', err);
      throw err;
    }
  }, []);

  const pushLocal = useCallback((n: Partial<AppNotification>) => {
    const notif: AppNotification = {
      id: String(n.id || Date.now()),
      message: n.message || n.data?.body || n.data?.message || '',
      timestamp: n.timestamp || Date.now(),
      read: !!n.read,
      type: (n.type as any) || 'system',
      data: n.data || {},
    };
    setNotifications(prev => [notif, ...prev]);
    setUnreadCount(c => c + (notif.read ? 0 : 1));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, refresh, markAsRead, markAllAsRead, remove, pushLocal }}>
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider');
  return ctx;
}

export default NotificationProvider;
