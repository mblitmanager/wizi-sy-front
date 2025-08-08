import { useEffect } from 'react';
import { messaging, onMessage } from '@/firebase-fcm';
import { toast } from 'sonner';

interface NotificationListenerProps {
  onPushNotification?: (notif: { id: string; message: string; type?: string; created_at?: string; data?: Record<string, unknown> }) => void;
}

// Ce composant écoute les notifications Pusher globalement
export default function NotificationListener({ onPushNotification }: NotificationListenerProps) {
  useEffect(() => {
    // Écoute des notifications en premier plan
    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification || {};
      const notif = {
        id: payload.data?.id || Date.now().toString(),
        message: body || '',
        type: payload.data?.type || 'system',
        created_at: payload.data?.created_at || new Date().toISOString(),
        data: payload.data || {},
        read: false,
      };
      toast(
        <div className="flex items-center gap-2">
          <span>🔔</span>
          <span className="font-medium">{title}</span>
          <span className="truncate max-w-xs">{body}</span>
        </div>,
        { duration: 5000 }
      );
      if (onPushNotification) {
        onPushNotification(notif);
      }
    });

    return () => {
      // Pas de désabonnement nécessaire pour onMessage
    };
  }, [onPushNotification]);

  return null;
}
