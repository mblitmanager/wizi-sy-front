import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Define the Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyAAAaZVClNlMXgTktyjUg8lhLG5zSue4YY",
  authDomain: "wizi-learn.firebaseapp.com",
  projectId: "wizi-learn",
  storageBucket: "wizi-learn.firebasestorage.app",
  messagingSenderId: "69521612278",
  appId: "1:69521612278:web:c1019585e1a905857c7bd7",
  measurementId: "G-K9Z9J0CQM7"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export function useFcmToken(userToken) {
  useEffect(() => {
    async function registerFcmToken() {
      try {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        const fcmToken = await getToken(messaging, { vapidKey });
        if (fcmToken) {
          const apiUrl = import.meta.env.VITE_API_URL || '';
          const url = apiUrl.endsWith('/') ? `${apiUrl}api/fcm-token` : `${apiUrl}/api/fcm-token`;
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': userToken ? `Bearer ${userToken}` : undefined,
            },
            body: JSON.stringify({ token: fcmToken })
          });
          if (!res.ok) {
            console.warn('Enregistrement FCM failed', await res.text());
          }
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
      // Affichez une notification formatée similaire au mobile
      const title = payload.notification?.title || 'Notification';
      const body = payload.notification?.body || '';
  const icon = '/favicon.ico';
      const image = payload.data?.image || payload.notification?.image;
      const data = payload.data || {};

      // Try to use the service worker to show the notification (keeps it in the notification center)
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg && reg.showNotification) {
            reg.showNotification(title, ({
              body,
              icon,
              badge: '/favicon.ico',
              // cast to any to allow non-standard image field in some browsers/types
              image,
              data: Object.assign({}, data, { link: data.link || '/' }),
            } as any));
            return;
          }
          // Fallback to Notification API
          new Notification(title, ({ body, icon, data: Object.assign({}, data, { link: data.link || '/' }) } as any));
        }).catch(err => {
          console.error('Erreur en affichant la notification via SW:', err);
          try {
            new Notification(title, ({ body, icon, data: Object.assign({}, data, { link: data.link || '/' }) } as any));
          } catch (e) {
            console.error('Notification API failed:', e);
          }
        });
      } else {
        try {
          new Notification(title, { body, icon, data: Object.assign({}, data, { link: data.link || '/' }) });
        } catch (e) {
          console.error('Notification API failed (no SW):', e);
          // As a last resort, update the UI; keep as simple alert for now
          alert(title + '\n' + body);
        }
      }
    });
  }, []);
}

export { messaging, getToken, onMessage };