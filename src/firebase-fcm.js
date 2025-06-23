import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  // Ajoutez ici votre configuration Firebase
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export function useFcmToken(userToken) {
  useEffect(() => {
    async function registerFcmToken() {
      try {
        const fcmToken = await getToken(messaging, { vapidKey: 'VOTRE_VAPID_KEY' });
        if (fcmToken) {
          await fetch('/fcm-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ token: fcmToken })
          });
        }
      } catch (err) {
        console.error('Erreur FCM', err);
      }
    }
    registerFcmToken();
  }, [userToken]);
}

export function useOnMessage() {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      // Affichez la notification ou mettez à jour l'UI
      alert(payload.notification?.title + '\n' + payload.notification?.body);
    });
  }, []);
}
