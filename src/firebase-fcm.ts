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

export { messaging, getToken, onMessage };