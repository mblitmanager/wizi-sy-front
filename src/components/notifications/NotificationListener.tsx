import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface NotificationListenerProps {
  onPushNotification?: (notif: { id: string; message: string; type?: string; created_at?: string; data?: any }) => void;
}

// Ce composant écoute les notifications Pusher globalement
export default function NotificationListener({ onPushNotification }: NotificationListenerProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true,
    });

    const allowedChannels = [
      'production',
      'message',
      'notification',
      'wizi-learn-production',
      'wizi-learn-development',
      'notifications',
    ];

    // Helper to normalize notification
    const normalizeNotif = (data: any, type = 'system') => ({
      id: data.id ? String(data.id) : `${Date.now()}-${Math.random()}`,
      message: data.message || data.body || 'Nouvelle notification',
      type: data.type || type,
      created_at: data.created_at || new Date().toISOString(),
      data,
      read: false,
    });

    const showNotification = (title, message, data = {}, type = 'system') => {
      toast(
        <div className="flex items-center gap-2">
          <span>🔔</span>
          <span className="font-medium">{title}</span>
          <span className="truncate max-w-xs">{message}</span>
        </div>,
        { duration: 5000 }
      );
      if (onPushNotification) {
        onPushNotification(normalizeNotif(data, type));
      }
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
          body: message,
          icon: "/favicon.ico"
        });
      }
    };

    const handleEvent = (eventName, data, channelName = '') => {
      const ignoredEvents = [
        'pusher:connection_established',
        'pusher_internal:subscription_succeeded',
        'pusher:subscription_succeeded',
        'pusher:member_added',
        'pusher:member_removed',
        'connection',
        'subscribed',
        'connected',
        'disconnected',
      ];
      if (ignoredEvents.includes(eventName.toLowerCase())) return;
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      const message = data?.message || JSON.stringify(data);
      showNotification(eventName, message, data, eventName.split('.')[0] || 'system');
    };

    const subscriptions = allowedChannels.map(channelName => {
      const ch = pusher.subscribe(channelName);
      ch.bind_global((eventName, data) => handleEvent(eventName, data, channelName));
      return ch;
    });

    const notificationChannel = pusher.subscribe('notification');
    notificationChannel.bind('test.notification', (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showNotification('Nouvelle notification', data.message, data, 'quiz');
    });
    notificationChannel.bind('iny', (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showNotification('Nouvelle notification', data.message || JSON.stringify(data), data, 'system');
    });

    return () => {
      subscriptions.forEach(ch => {
        ch.unbind_global();
        ch.unsubscribe();
      });
      notificationChannel.unbind_all();
      notificationChannel.unsubscribe();
      pusher.disconnect();
    };
  }, [queryClient, onPushNotification]);

  return null;
}
