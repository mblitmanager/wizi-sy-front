import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Icône par type de notification
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

// Affichage si aucune notification
const EmptyState = () => (
  <Card className="p-8 text-center bg-white border border-gray-100 shadow-none">
    <Bell className="h-10 w-10 mx-auto mb-3 text-gray-300" />
    <h3 className="text-base font-medium mb-1 text-gray-700">Aucune notification</h3>
    <p className="text-gray-400 text-sm">Vous n'avez pas encore de notifications</p>
  </Card>
);

// Composant Notification individuel
const NotificationItem = ({ 
  notification, 
  markAsRead, 
  deleteNotification 
}: { 
  notification: Notification; 
  markAsRead: (id: number) => void; 
  deleteNotification: (id: number) => void;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Redirection en fonction du type de notification
    switch (notification.type) {
      case 'quiz':
        navigate('/quiz');
        break;
      case 'formation':
        navigate('/formations');
        break;
      case 'badge':
        navigate('/badges');
        break;
      case 'media':
        navigate('/medias');
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.is_read ? 'bg-orange-50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-sm mb-0.5 line-clamp-2 ${!notification.is_read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(notification.created_at).toLocaleString('fr-FR', {
            dateStyle: 'short',
            timeStyle: 'short',
          })}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Supprimer"
        onClick={(e) => {
          e.stopPropagation();
          deleteNotification(notification.id);
        }}
        className="flex-shrink-0 text-gray-400 hover:text-red-500"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Page principale
export default function NotificationsPage() {
  const { user } = useUser();
  const {
    notifications: notificationsFromHook,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  // État local pour affichage instantané
  const [notifications, setNotifications] = useState<Notification[]>(
    Array.isArray(notificationsFromHook) ? notificationsFromHook : []
  );

  // Sync local state uniquement si le contenu a changé (évite boucle infinie)
  useEffect(() => {
    if (Array.isArray(notificationsFromHook)) {
      if (
        notificationsFromHook.length !== notifications.length ||
        notificationsFromHook.some((n, i) => n.id !== notifications[i]?.id)
      ) {
        setNotifications(notificationsFromHook);
      }
    }
  }, [notificationsFromHook, notifications]);

  // Suppression instantanée
  const handleDelete = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    deleteNotification(id);
  }, [deleteNotification]);

  // Marquer comme lu lors du scroll (IntersectionObserver)
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const notifId = entry.target.getAttribute('data-id');
            const notif = notifications.find(n => n.id === Number(notifId));
            if (notif && !notif.is_read) {
              markAsRead(notif.id);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    Object.values(itemRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [notifications, markAsRead]);

  // Notification push si nouvelle
  const prevNotifCount = React.useRef(notifications.length);
  React.useEffect(() => {
    if (notifications.length > prevNotifCount.current) {
      const newNotif = notifications.find(n => !n.is_read);
      if (newNotif) {
        toast(
          <div className="flex items-center gap-2 bg-orange-400 text-white p-3 rounded">
            <span>{getNotificationIcon(newNotif.type)}</span>
            {/* <span className="font-medium">Nouvelle notification :</span> */}
            <span className="truncate max-w-xs">{newNotif.message}</span>
          </div>,
          { duration: 5000 }
        );

        if ('Notification' in window) {
          if (Notification.permission === 'granted') {
            new Notification('Nouvelle notification', {
              body: newNotif.message,
              icon: '/favicon.ico'
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
              if (permission === 'granted') {
                new Notification('Nouvelle notification', {
                  body: newNotif.message,
                  icon: '/favicon.ico'
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
      <div className="w-full max-w-[95%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[65%] mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Notifications</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => markAllAsRead()}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                <Check className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
              <Button
                variant="ghost"
                onClick={() => notifications.forEach(n => deleteNotification(n.id))}
                className="text-sm text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Tout supprimer
              </Button>
            </div>
          </div>
        </div>

        {/* Contenu notifications */}
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {notifications.map(notification => (
              <div
                key={notification.id}
                data-id={notification.id}
                ref={el => (itemRefs.current[notification.id] = el)}
              >
                <NotificationItem
                  notification={notification}
                  markAsRead={markAsRead}
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
