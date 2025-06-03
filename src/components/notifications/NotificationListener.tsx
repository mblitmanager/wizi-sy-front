import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

// Ce composant écoute les notifications Pusher globalement
export default function NotificationListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (import.meta.env.MODE !== "production") return;
    // Configurez Pusher avec vos variables d'environnement
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true,
    });
    const channel = pusher.subscribe('notification');
    channel.bind('test.notification', (data) => {
      // Rafraîchir les notifications (query react-query)
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      // Afficher un toast
      toast(
        <div className="flex items-center gap-2">
          <span>🔔</span>
          <span className="font-medium">Nouvelle notification :</span>
          <span className="truncate max-w-xs">{data.message}</span>
        </div>,
        { duration: 5000 }
      );
      // Notification navigateur
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("Nouvelle notification", {
            body: data.message,
            icon: "/favicon.ico"
          });
        }
      }
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [queryClient]);

  return null;
}
