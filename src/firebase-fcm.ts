import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Define the Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyAAAaZVClNlMXgTktyjUg8lhLG5zSue4YY",
  authDomain: "wizi-learn.firebaseapp.com",
  projectId: "wizi-learn",
  storageBucket: "wizi-learn.firebasestorage.app",
  messagingSenderId: "69521612278",
  appId: "1:69521612278:web:c1019585e1a905857c7bd7",
  measurementId: "G-K9Z9J0CQM7",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

import { api } from "./services/api";

export function useFcmToken(userToken: string | null) {
  useEffect(() => {
    async function registerFcmToken() {
      if (!userToken) return;

      try {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
        const fcmToken = await getToken(messaging, { vapidKey });

        if (fcmToken) {
          console.log("FCM Token retrieved:", fcmToken);
          const response = await api.post("/notifications/fcm-token", {
            token: fcmToken,
          });
          console.log("FCM Token registration response:", response.data);
        }
      } catch (err) {
        console.error("Erreur FCM", err);
      }
    }
    registerFcmToken();
  }, [userToken]);
}

export function useOnMessage() {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      // Affichez une notification formatée similaire au mobile
      const title = payload.notification?.title || "Notification";
      const body = payload.notification?.body || "";
      const icon = "/favicon2.ico";
      const image = payload.data?.image || payload.notification?.image;
      const data = payload.data || {};

      // Try to use the service worker to show the notification (keeps it in the notification center)
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker
          .getRegistration()
          .then((reg) => {
            if (reg && reg.showNotification) {
              reg.showNotification(title, {
                body,
                icon,
                badge: "/favicon2.ico",
                // cast to any to allow non-standard image field in some browsers/types
                image,
                data: Object.assign({}, data, { link: data.link || "/" }),
              } as any);
              return;
            }
            // Fallback to Notification API
            new Notification(title, {
              body,
              icon,
              data: Object.assign({}, data, { link: data.link || "/" }),
            } as any);
          })
          .catch((err) => {
            console.error("Erreur en affichant la notification via SW:", err);
            try {
              new Notification(title, {
                body,
                icon,
                data: Object.assign({}, data, { link: data.link || "/" }),
              } as any);
            } catch (e) {
              console.error("Notification API failed:", e);
            }
          });
      } else {
        try {
          new Notification(title, {
            body,
            icon,
            data: Object.assign({}, data, { link: data.link || "/" }),
          });
        } catch (e) {
          console.error("Notification API failed (no SW):", e);
          // As a last resort, update the UI; keep as simple alert for now
          alert(title + "\n" + body);
        }
      }
    });
  }, []);
}

export { messaging, getToken, onMessage };
