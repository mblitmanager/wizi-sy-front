import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { useFcmToken, useOnMessage } from '../firebase-fcm';

export default function NotificationListener({ userId, userToken }) {
  useFcmToken(userToken); // Enregistre le token FCM côté backend
  useOnMessage(); // Affiche les notifications FCM reçues

  useEffect(() => {
    if (!userId) return;
    const pusher = new Pusher('VOTRE_PUSHER_KEY', { cluster: 'VOTRE_CLUSTER' });
    const channel = pusher.subscribe(`user-${userId}`);
    channel.bind('notification', data => {
      // Affiche la notification Pusher
      alert((data.title || 'Notification') + '\n' + (data.body || ''));
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId]);

  return null;
}
