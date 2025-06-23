import { useEffect } from 'react';
import { messaging, onMessage, getToken } from '@/firebase-fcm';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || "https://wizi-learn.com/api";

interface NotificationListenerProps {
  onPushNotification?: (notif: { id: string; message: string; type?: string; created_at?: string; data?: any }) => void;
}

// Ce composant écoute les notifications Pusher globalement
export default function NotificationListener({ onPushNotification }: NotificationListenerProps) {
  useEffect(() => {
    // Demander le token FCM (à stocker côté backend si besoin)
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    getToken(messaging, { vapidKey })
      .then(async (currentToken) => {
        if (currentToken) {
          // Envoyer ce token à votre backend
          try {
            await fetch(`${API_URL}/fcm-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                // Ajoutez ici l'Authorization si besoin
              },
              body: JSON.stringify({ token: currentToken })
            });
            console.log("FCM Token envoyé au backend:", currentToken);
          } catch (err) {
            console.error('Erreur lors de l\'envoi du token FCM au backend', err);
          }
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération du token FCM", err);
      });

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
