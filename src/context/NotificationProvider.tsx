import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { notificationService, Notification as ServiceNotification } from '@/services/NotificationService';

export interface AppNotification extends ServiceNotification {
  // keep extensible shape for UI
  data?: Record<string, unknown>;
  serverId?: string; // canonical server id (if available)
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
  const [seenServerIds, setSeenServerIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    try {
      const list = await notificationService.getNotifications();
      // normalize data shape if needed
      const normalized: AppNotification[] = (list || []).map((item: unknown) => {
        const obj = (item || {}) as Record<string, unknown>;
        const serverIdRaw = obj['id'] ?? obj['_id'] ?? obj['uuid'] ?? obj['key'] ?? '';
        const serverId = serverIdRaw != null ? String(serverIdRaw) : '';
        const message = String(obj['message'] ?? obj['body'] ?? obj['title'] ?? '');
        const tsRaw = obj['timestamp'] ?? obj['created_at'];
        const timestamp = tsRaw != null ? Number(tsRaw) : Date.now();
        const read = Boolean(obj['read']);
        const type = typeof obj['type'] === 'string' ? String(obj['type']) : 'system';
        const data = ((obj['data'] ?? obj['payload']) as Record<string, unknown> | undefined) ?? {};
        const typedType = (typeof obj['type'] === 'string' ? String(obj['type']) : 'system') as ServiceNotification['type'];
        return {
          id: serverId || String(Date.now()),
          serverId: serverId || undefined,
          message,
          timestamp,
          read,
          type: typedType,
          data,
        } as AppNotification;
      });

      // Merge server notifications with any local-only notifications (without serverId)
      setNotifications(prev => {
        const localOnly = (prev || []).filter(p => !p.serverId);
        // Server list should be canonical; keep local-only appended if they are not duplicates
        return [...normalized, ...localOnly];
      });
      // update seen IDs
      setSeenServerIds(new Set(normalized.map(n => (n.serverId || n.id))));
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
    const serverId = n.serverId || n.data?.server_id || n.data?.id || undefined;
    // If we already saw this server id, don't insert duplicate
    if (serverId && seenServerIds.has(String(serverId))) return;

    const obj = n as Partial<AppNotification>;
    const dataRec = obj.data as Record<string, unknown> | undefined;
    const messageFromData = dataRec ? (String(dataRec['body'] ?? dataRec['message'] ?? '')) : '';
    const message = obj.message ?? messageFromData ?? '';
    const notif: AppNotification = {
      id: String(obj.id ?? serverId ?? Date.now()),
      serverId: serverId ? String(serverId) : undefined,
      message,
      timestamp: obj.timestamp ?? Date.now(),
      read: !!obj.read,
      type: (obj.type as ServiceNotification['type']) ?? 'system',
      data: obj.data ?? {},
    } as AppNotification;

    setNotifications(prev => [notif, ...prev]);
    if (notif.serverId) setSeenServerIds(s => new Set(s).add(notif.serverId!));
    setUnreadCount(c => c + (notif.read ? 0 : 1));
  }, [seenServerIds]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, refresh, markAsRead, markAllAsRead, remove, pushLocal }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
