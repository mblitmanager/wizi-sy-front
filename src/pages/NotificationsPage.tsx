import React, { useRef, useEffect, useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useUser } from "@/hooks/useAuth";
import { toast } from "sonner";
import NotificationListener from "@/components/notifications/NotificationListener";
import { useNavigate } from "react-router-dom";

// Icône par type de notification
const getNotificationIcon = (type: string) => {
  switch (type) {
    case "quiz":
      return "📝";
    case "formation":
      return "📚";
    case "badge":
      return "🏆";
    default:
      return "🔔";
  }
};

// Affichage si aucune notification
const EmptyState = () => (
  <Card className="p-8 text-center bg-white border border-gray-100 shadow-none">
    <Bell className="h-10 w-10 mx-auto mb-3 text-gray-300" />
    <h3 className="text-base font-medium mb-1 text-gray-700">
      Aucune notification
    </h3>
    <p className="text-gray-400 text-sm">
      Vous n'avez pas encore de notifications
    </p>
  </Card>
);

// Composant Notification individuel
const NotificationItem = ({
  notification,
  markAsRead,
  deleteNotification,
}: any) => {
  const navigate = useNavigate();

  // Redirection logic based on notification type
  const handleClick = () => {
    if (!notification.read) markAsRead(notification.id);
    switch (notification.type) {
      case "quiz":
        navigate("/quiz");
        break;
      case "formation":
        navigate("/formations");
        break;
      case "badge":
        navigate("/badges");
        break;
      case "media":
        navigate("/tuto-astuce");
        break;
      default:
        // No redirection for unknown types
        break;
    }
  };

  return (
    <Card
      className={`p-3 sm:p-4 border border-gray-100 shadow-none transition-colors flex flex-col gap-3 ${
        notification.read ? "bg-gray-50" : "bg-white"
      }`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-1">
          {getNotificationIcon(notification.type)}
        </span>
        <div className="flex-1">
          <p className="text-sm text-gray-700 mb-1">{notification.message}</p>
          <p className="text-xs text-gray-400">
            {new Date(notification.created_at).toLocaleString("fr-FR", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-1">
        {!notification.read && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Marquer comme lu"
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification.id);
            }}
            className="text-gray-400 hover:text-green-600">
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Supprimer"
          onClick={(e) => {
            e.stopPropagation();
            deleteNotification(notification.id);
          }}
          className="text-gray-400 hover:text-red-500">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

// Helper to load notifications from sessionStorage
function loadNotificationsFromSession() {
  try {
    const data = sessionStorage.getItem('notifications');
    if (data) return JSON.parse(data);
  } catch {}
  return [];
}
// Helper to save notifications to sessionStorage
function saveNotificationsToSession(notifs: any[]) {
  try {
    sessionStorage.setItem('notifications', JSON.stringify(notifs));
  } catch {}
}

// Page principale
export default function NotificationsPage() {
  const { user } = useUser();
  const {
    notifications: notificationsFromHook,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  // Load notifications from sessionStorage or from hook
  const [notifications, setNotifications] = useState(() => {
    const sessionNotifs = loadNotificationsFromSession();
    return sessionNotifs.length > 0 ? sessionNotifs : notificationsFromHook;
  });

  // Save notifications to sessionStorage on change
  useEffect(() => {
    saveNotificationsToSession(notifications);
  }, [notifications]);

  // Merge notifications from hook and local (Pusher) notifications, deduplicated by id
  const mergedNotifications = React.useMemo(() => {
    const map = new Map();
    [...notificationsFromHook, ...notifications].forEach((n) => {
      map.set(n.id, { ...n });
    });
    // Sort by created_at descending
    return Array.from(map.values()).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [notificationsFromHook, notifications]);

  // Compute unread count from merged notifications
  const unreadCount = React.useMemo(() => mergedNotifications.filter(n => !n.read).length, [mergedNotifications]);

  // Marquer une notification comme lue
  const handleMarkAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      markAsRead(id);
    },
    [markAsRead]
  );

  // Marquer toutes les notifications comme lues
  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllAsRead();
  }, [markAllAsRead]);

  // Suppression instantanée
  const handleDelete = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      deleteNotification(id);
    },
    [deleteNotification]
  );

  // Tout supprimer
  const handleDeleteAll = useCallback(() => {
    setNotifications([]);
    mergedNotifications.forEach((n) => deleteNotification(n.id));
  }, [deleteNotification, mergedNotifications]);

  // Marquer comme lu lors du scroll (IntersectionObserver)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const notifId = entry.target.getAttribute("data-id");
            const notif = notifications.find((n) => n.id === notifId);
            if (notif && !notif.read) {
              markAsRead(notif.id);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    Object.values(itemRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [notifications, markAsRead]);

  // Notification push si nouvelle
  const prevNotifCount = React.useRef(notifications.length);
  React.useEffect(() => {
    if (notifications.length > prevNotifCount.current) {
      const newNotif = notifications.find((n) => !n.read);
      if (newNotif) {
        toast(
          <div className="flex items-center gap-2 bg-orange-400 text-white p-3 rounded">
            <span>{getNotificationIcon(newNotif.type)}</span>
            {/* <span className="font-medium">Nouvelle notification :</span> */}
            <span className="truncate max-w-xs">{newNotif.message}</span>
          </div>,
          { duration: 5000 }
        );

        if ("Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification("Nouvelle notification", {
              body: newNotif.message,
              icon: "/favicon.ico",
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification("Nouvelle notification", {
                  body: newNotif.message,
                  icon: "/favicon.ico",
                });
              }
            });
          }
        }
      }
    }
    prevNotifCount.current = notifications.length;
  }, [notifications]);

  // Handler to add Pusher notifications to local state (display once, deduplicate with backend)
  const handlePushNotification = (notif: any) => {
    // Check if notification already exists in local or backend/hook notifications
    const exists = notifications.some((n) => n.id === notif.id) ||
      notificationsFromHook.some((n) => n.id === notif.id);
    if (exists) return;
    // Show toast and browser notification only if new
    toast(
      <div className="flex items-center gap-2 bg-orange-400 text-white p-3 rounded">
        <span>{getNotificationIcon(notif.type)}</span>
        <span className="truncate max-w-xs">{notif.message}</span>
      </div>,
      { duration: 5000 }
    );
      if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Nouvelle notification", {
        body: notif.message,
        icon: "/favicon.ico",
      });
    }
    setNotifications((prev) => [notif, ...prev]);
  };

  return (
    <Layout>
      {/* Listen for Pusher notifications and add to state */}
      <NotificationListener onPushNotification={handlePushNotification} />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-[-15%] md:mt-0">
        {/* Header sticky */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 py-3 px-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
            <h1 className="text-2xl font-semibold text-brown-shade">
              Notifications
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="text-sm w-full sm:w-auto">
                <Check className="h-4 w-4 mr-2" />
                Tout marquer comme lu
                {unreadCount > 0 && (
                  <span className="ml-2 text-xs text-green-600">({unreadCount} non lues)</span>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteAll}
                className="text-sm text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Tout supprimer
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu notifications */}
        {mergedNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-2">
            {mergedNotifications.map((notification) => (
              <div
                key={notification.id}
                data-id={notification.id}
                ref={(el) => (itemRefs.current[notification.id] = el)}>
                <NotificationItem
                  notification={notification}
                  markAsRead={handleMarkAsRead}
                  deleteNotification={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
