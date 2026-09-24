import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { notificationService, ApiNotification } from "@/services/NotificationService";
import { useUser } from "@/context/UserContext";

export type AppNotification = ApiNotification;

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  /** Vrai pendant le premier chargement de la liste. */
  isLoading: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: string | number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  remove: (id: string | number) => Promise<void>;
  pushLocal: (n: Partial<AppNotification>) => void;
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function useNotificationContext(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotificationContext must be used within NotificationProvider");
  return ctx;
}

/** Délai avant de resynchroniser avec le serveur après une notification push. */
const REFRESH_DEBOUNCE_MS = 2000;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useUser();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(!!token);
  const seenIds = useRef<Set<number | string>>(new Set());
  const refreshTimer = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    const [list, count] = await Promise.all([
      notificationService.getNotifications(),
      notificationService.getUnreadCount().catch(() => null),
    ]);
    const normalized = list.map((item) => ({ ...item, data: item.data || {} }));

    seenIds.current = new Set(normalized.map((n) => n.id));
    setNotifications(normalized);
    setUnreadCount(count != null ? Number(count) : normalized.filter((n) => !n.read).length);
  }, []);

  // Chargement à la connexion, remise à zéro à la déconnexion
  useEffect(() => {
    if (token) {
      setIsLoading(true);
      refresh()
        .catch((err) => console.error("Chargement des notifications impossible :", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
      seenIds.current = new Set();
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token, refresh]);

  useEffect(
    () => () => {
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    },
    []
  );

  const markAsRead = useCallback(async (id: string | number) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const remove = useCallback(
    async (id: string | number) => {
      const wasUnread = notifications.some((n) => n.id === id && !n.read);
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    },
    [notifications]
  );

  const pushLocal = useCallback(
    (n: Partial<AppNotification>) => {
      if (n.id && seenIds.current.has(n.id)) return;

      const now = new Date().toISOString();
      const notif: AppNotification = {
        id: n.id || Date.now(),
        user_id: n.user_id || 0,
        type: n.type || "system",
        title: n.title,
        message: n.message || "",
        data: n.data || {},
        read: !!n.read,
        created_at: n.created_at || now,
        updated_at: n.updated_at || now,
      };

      seenIds.current.add(notif.id);
      setNotifications((prev) => [notif, ...prev]);
      if (!notif.read) setUnreadCount((c) => c + 1);

      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
      refreshTimer.current = window.setTimeout(() => {
        refreshTimer.current = null;
        refresh().catch((err) => console.error("Resynchronisation des notifications impossible :", err));
      }, REFRESH_DEBOUNCE_MS);
    },
    [refresh]
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, isLoading, refresh, markAsRead, markAllAsRead, remove, pushLocal }),
    [notifications, unreadCount, isLoading, refresh, markAsRead, markAllAsRead, remove, pushLocal]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export default NotificationProvider;
