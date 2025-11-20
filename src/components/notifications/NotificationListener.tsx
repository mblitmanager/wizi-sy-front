import { useEffect } from 'react';
import { messaging, onMessage } from '@/firebase-fcm';
import { toast } from 'sonner';
import { useNotifications } from '@/hooks/useNotifications';

// Ce composant écoute les notifications FCM en premier plan et les synchronise avec l'API
export default function NotificationListener({ onPushNotification }: { onPushNotification?: (n: any) => void }) {
  const { pushLocal } = useNotifications();

  useEffect(() => {
    const unsub = onMessage(messaging, async (payload) => {
      const { title, body } = payload.notification || {};
      const data = payload.data || {};
      const notif = {
        id: data.id || Date.now().toString(),
        message: body || data.message || '',
        type: data.type || 'system',
        created_at: data.created_at || new Date().toISOString(),
        data,
        read: false,
      };

      // show toast/notification
      toast(
        <div className="flex items-center gap-2">
          <span>🔔</span>
          <span className="font-medium">{title}</span>
          <span className="truncate max-w-xs">{body}</span>
        </div>,
        { duration: 5000 }
      );

  // Add to local state so UI updates immediately
  // The provider will schedule a debounced refresh to sync with server
      pushLocal(notif as any);

      // also notify any parent callback (e.g. page-level handler used for toasts when app is visible)
      if (onPushNotification) onPushNotification(notif);
    });

    return () => {
      // onMessage has no unsubscribe callback in older firebase versions; keep return for future-proof
      if (typeof unsub === 'function') unsub();
    };
  }, [pushLocal, onPushNotification]);

  return null;
}
