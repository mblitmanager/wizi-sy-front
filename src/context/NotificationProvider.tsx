import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { notificationService, ApiNotification } from '@/services/NotificationService';

export interface AppNotification extends ApiNotification {
  // UI helper fields if needed, but we try to stick to ApiNotification
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  refresh: () => Promise<void>;
  markAsRead: (id: string | number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  remove: (id: string | number) => Promise<void>;
  pushLocal: (n: Partial<AppNotification>) => void;
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

// Convenience hook for consumers which also throws when used outside provider
export function useNotificationContext(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext must be used within NotificationProvider');
  return ctx;
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [seenIds, setSeenIds] = useState<Set<number | string>>(new Set());

  const refresh = useCallback(async () => {
    try {
      const list = await notificationService.getNotifications();

      // No complex normalization needed anymore as we aligned types
      const normalized: AppNotification[] = list.map(item => ({
        ...item,
        // Ensure data is at least an empty object if null
        data: item.data || {},
      }));

      // Merge server notifications with any local-only notifications
      // For now, we trust the server list as canonical
      setNotifications(normalized);

      // update seen IDs
      setSeenIds(new Set(normalized.map(n => n.id)));

      // try to get unread count from API if available
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(Number(count));
      } catch (e) {
        setUnreadCount(normalized.filter(n => !n.read).length);
      }
    } catch (err) {
      console.error('Failed to refresh notifications:', err);
    }
  }, []);

  // Debounce timer for server refreshes after incoming push notifications
  const refreshTimer = useRef<number | null>(null);
  const REFRESH_DEBOUNCE_MS = 2000;

  useEffect(() => {
    // initial load: only refresh if we have a token (avoid 401 on public pages)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    // initial load
    refresh();
  }, [refresh]);

  const markAsRead = useCallback(async (id: string | number) => {
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

  const remove = useCallback(async (id: string | number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('remove notification failed', err);
      throw err;
    }
  }, []);

  const pushLocal = useCallback((n: Partial<AppNotification>) => {
    // If we already saw this id, don't insert duplicate
    if (n.id && seenIds.has(n.id)) return;

    // Construct a temporary AppNotification
    const notif: AppNotification = {
      id: n.id || Date.now(), // Use timestamp as temp ID if missing
      user_id: n.user_id || 0,
      type: n.type || 'system',
      message: n.message || '',
      data: n.data || {},
      read: !!n.read,
      created_at: n.created_at || new Date().toISOString(),
      updated_at: n.updated_at || new Date().toISOString(),
    };

    setNotifications(prev => [notif, ...prev]);
    if (notif.id) setSeenIds(s => new Set(s).add(notif.id));
    setUnreadCount(c => c + (notif.read ? 0 : 1));

    // Schedule a debounced refresh from the server to ensure canonical state
    if (refreshTimer.current) {
      window.clearTimeout(refreshTimer.current);
    }
    refreshTimer.current = window.setTimeout(() => {
      refresh().catch(err => console.error('Refresh after push failed', err));
      refreshTimer.current = null;
    }, REFRESH_DEBOUNCE_MS);
  }, [seenIds, refresh]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, refresh, markAsRead, markAllAsRead, remove, pushLocal }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
