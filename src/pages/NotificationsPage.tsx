import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const { user } = useUser();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return '📝';
      case 'formation':
        return '📚';
      case 'badge':
        return '🏆';
      default:
        return '🔔';
    }
  };

  // Notif push pour nouvelle notification
  const prevNotifCount = React.useRef(notifications.length);
  React.useEffect(() => {
    if (notifications.length > prevNotifCount.current) {
      // Cherche la dernière notification non lue
      const newNotif = notifications.find(n => !n.read);
      if (newNotif) {
        toast(
          <div className="flex items-center gap-2">
            <span>{getNotificationIcon(newNotif.type)}</span>
            <span className="font-medium">Nouvelle notification :</span>
            <span className="truncate max-w-xs">{newNotif.message}</span>
          </div>,
          { duration: 5000 }
        );
        // Notification navigateur
        if ("Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification("Nouvelle notification", {
              body: newNotif.message,
              icon: "/favicon.ico"
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                new Notification("Nouvelle notification", {
                  body: newNotif.message,
                  icon: "/favicon.ico"
                });
              }
            });
          }
        }
      }
    }
    prevNotifCount.current = notifications.length;
  }, [notifications]);

  return (
    <Layout>
      <div className="container max-w-2xl mx-auto px-2 sm:px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Notifications</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => markAllAsRead()}
              className="flex items-center gap-2 text-sm"
            >
              <Check className="h-4 w-4" />
              Tout marquer comme lu
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (notifications.length === 0) return;
                notifications.forEach(n => deleteNotification(n.id));
              }}
              className="flex items-center gap-2 text-sm text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Tout supprimer
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <Card className="p-8 text-center bg-white border border-gray-100 shadow-none">
            <Bell className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <h3 className="text-base font-medium mb-1 text-gray-700">Aucune notification</h3>
            <p className="text-gray-400 text-sm">
              Vous n'avez pas encore de notifications
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map(notification => (
              <Card
                key={notification.id}
                className={`p-3 sm:p-4 flex items-center gap-3 border border-gray-100 shadow-none transition-colors ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
              >
                <span className="text-xl sm:text-2xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <p className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(notification.created_at).toLocaleString('fr-FR', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                    <p className="truncate text-sm text-gray-700 mt-1 sm:mt-0">{notification.message}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Marquer comme lu"
                      onClick={() => markAsRead(notification.id)}
                      className="text-gray-400 hover:text-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Supprimer"
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}