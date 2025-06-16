import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// Ce composant écoute les notifications Pusher globalement
export default function NotificationListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    Pusher.logToConsole = true;
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true,
    });

    // Liste des channels à écouter
    const allowedChannels = [
      'production',
      'message',
      'notification',
      'wizi-learn-production',
      'wizi-learn-development',
      'notifications',
    ];

    // Fonction utilitaire pour afficher un toast et une notification navigateur
    const showNotification = (title, message) => {
      toast(
        <div className="flex items-center gap-2">
          <span>🔔</span>
          <span className="font-medium">{title}</span>
          <span className="truncate max-w-xs">{message}</span>
        </div>,
        { duration: 5000 }
      );
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
          body: message,
          icon: "/favicon.ico"
        });
      }
    };

    // Fonction de callback générique
    const handleEvent = (eventName, data, channelName = '') => {
      // Ne pas afficher de notification pour les events de connexion ou de souscription
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
      const title = channelName
        ? `Event Pusher : ${eventName} (${channelName})`
        : `Event Pusher : ${eventName}`;
      // showNotification(title, message);
      showNotification(eventName, message);
    };

    // Souscription et binding pour chaque channel autorisé
    const subscriptions = allowedChannels.map(channelName => {
      const ch = pusher.subscribe(channelName);
      ch.bind_global((eventName, data) => handleEvent(eventName, data, channelName));
      console.log(`Subscribed to channel: ${channelName}`);
      console.log(ch);
      return ch;
    });

    // Pour compatibilité, on garde les events spécifiques sur 'notification'
    const notificationChannel = pusher.subscribe('notification');
    notificationChannel.bind('test.notification', (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showNotification('Nouvelle notification', data.message);
    });
    notificationChannel.bind('iny', (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showNotification('Nouvelle notification', data.message || JSON.stringify(data));
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
  }, [queryClient]);

  return null;
}
