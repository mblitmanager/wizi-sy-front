import { useCallback, useEffect, useMemo, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useUser } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AppNotification } from "@/context/NotificationProvider";

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
  user,
}: {
  notification: AppNotification;
  markAsRead: (id: number | string) => void;
  deleteNotification: (id: number | string) => void;
  user: {
    user?: { role?: string };
    role?: string;
  } | null;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.read) markAsRead(notification.id);
    const userRole = user?.user?.role || user?.role;
    const isFormateur = userRole === 'formateur' || userRole === 'formatrice';

    switch (notification.type) {
      case "quiz": navigate(isFormateur ? "/formateur/dashboard" : "/quizzes"); break;
      case "formation": navigate(isFormateur ? "/formateur/dashboard" : "/formations"); break;
      case "badge": navigate(isFormateur ? "/formateur/dashboard" : "/profile/badges"); break;
      case "media": navigate(isFormateur ? "/formateur/videos" : "/tuto-astuce"); break;
      default: break;
    }
  };

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 group relative overflow-hidden ${notification.read
        ? "bg-gray-50/50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-700/50"
        : "bg-white dark:bg-gray-800 border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-md"
        }`}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      {!notification.read && (
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
      )}
      
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${notification.read ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
          <span className="text-xl">
            {getNotificationIcon(notification.type)}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            {notification.title && (
              <h4 className={`text-sm font-bold truncate ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                {notification.title}
              </h4>
            )}
            <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full">
              {(() => {
                const date = new Date(notification.created_at);
                if (Number.isNaN(date.getTime())) return '—';
                return date.toLocaleString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              })()}
            </span>
          </div>
          <p className={`text-sm mt-1 leading-relaxed ${notification.read ? 'text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
            {notification.message}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notification.id);
            }}
            className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <Check className="h-4 w-4 mr-1" />
            Lu
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            deleteNotification(notification.id);
          }}
          className="h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

function NotificationListSkeleton() {
  return (
    <div className="flex flex-col gap-2" role="status" aria-live="polite">
      <span className="sr-only">Chargement des notifications…</span>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
      ))}
    </div>
  );
}

// Page principale : affiche l'état du NotificationProvider (source unique de vérité)
export default function NotificationsPage() {
  const { user } = useUser();
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, remove } = useNotifications();

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [notifications]
  );

  // Les notifications visibles à l'écran sont marquées comme lues (une seule fois chacune)
  const pendingReads = useRef(new Set<string>());
  const markVisibleAsRead = useCallback(
    (id: number | string) => {
      const key = String(id);
      if (pendingReads.current.has(key)) return;
      pendingReads.current.add(key);
      markAsRead(id).catch(() => pendingReads.current.delete(key));
    },
    [markAsRead]
  );

  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const notif = notifications.find((n) => String(n.id) === entry.target.getAttribute("data-id"));
          if (notif && !notif.read) markVisibleAsRead(notif.id);
        });
      },
      { threshold: 0.5 }
    );
    Object.values(itemRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [notifications, markVisibleAsRead]);

  const handleMarkAsRead = useCallback((id: number | string) => markVisibleAsRead(id), [markVisibleAsRead]);

  const handleDelete = useCallback(
    (id: number | string) => {
      remove(id).catch(() => toast.error("Suppression impossible"));
    },
    [remove]
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsRead().catch(() => toast.error("Impossible de tout marquer comme lu"));
  }, [markAllAsRead]);

  const handleDeleteAll = useCallback(async () => {
    const results = await Promise.allSettled(notifications.map((n) => remove(n.id)));
    if (results.some((r) => r.status === "rejected")) {
      toast.error("Certaines notifications n'ont pas pu être supprimées");
    }
  }, [remove, notifications]);

  return (
    <Layout>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête collé sous le header de l'application */}
        <div className="sticky top-12 md:top-14 lg:top-16 z-10 bg-white border-b border-gray-100 py-3 px-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
            <h1 className="text-2xl font-semibold text-brown-shade">Notifications</h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="text-sm w-full sm:w-auto">
                <Check className="h-4 w-4 mr-2" />
                Tout marquer comme lu
                {unreadCount > 0 && <span className="ml-2 text-xs text-green-600">({unreadCount} non lues)</span>}
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteAll}
                disabled={notifications.length === 0}
                className="text-sm text-red-600 border-red-200 hover:bg-red-50 w-full sm:w-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Tout supprimer
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <NotificationListSkeleton />
        ) : sortedNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-2">
            {sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                data-id={notification.id}
                ref={(el) => (itemRefs.current[String(notification.id)] = el)}>
                <NotificationItem
                  notification={notification}
                  markAsRead={handleMarkAsRead}
                  deleteNotification={handleDelete}
                  user={user}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
