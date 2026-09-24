import { useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  isSupported,
  Messaging,
  MessagePayload,
  onMessage,
} from "firebase/messaging";
import { isAxiosError } from "axios";
import { api } from "@/lib/api";

const firebaseConfig = {
  apiKey: "AIzaSyAAAaZVClNlMXgTktyjUg8lhLG5zSue4YY",
  authDomain: "wizi-learn.firebaseapp.com",
  projectId: "wizi-learn",
  storageBucket: "wizi-learn.firebasestorage.app",
  messagingSenderId: "69521612278",
  appId: "1:69521612278:web:c1019585e1a905857c7bd7",
  measurementId: "G-K9Z9J0CQM7",
};

let messagingPromise: Promise<Messaging | null> | null = null;

/**
 * Firebase Messaging n'existe pas partout (Safari iOS hors PWA, navigation privée...).
 * `getMessaging()` lève dans ce cas : on ne l'appelle qu'après `isSupported()`.
 */
export function getMessagingSafe(): Promise<Messaging | null> {
  if (!messagingPromise) {
    messagingPromise = isSupported()
      .then((supported) => (supported ? getMessaging(initializeApp(firebaseConfig)) : null))
      .catch(() => null);
  }
  return messagingPromise;
}

async function sendFcmTokenToBackend(fcmToken: string) {
  try {
    await api.post("/notifications/fcm-token", { token: fcmToken });
  } catch (err) {
    // Ancien endpoint encore utilisé par certaines versions du backend
    if (isAxiosError(err) && err.response?.status === 404) {
      await api.post("/fcm-token", { token: fcmToken });
    } else {
      throw err;
    }
  }
}

/** Enregistre le token FCM du navigateur dès qu'une session utilisateur existe. */
export function useFcmToken(userToken: string | null) {
  useEffect(() => {
    if (!userToken || !("Notification" in window)) return;

    (async () => {
      const messaging = await getMessagingSafe();
      if (!messaging) return;
      try {
        // getToken demande la permission si elle n'a pas encore été accordée
        const fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });
        if (fcmToken) await sendFcmTokenToBackend(fcmToken);
      } catch (err) {
        console.warn("Enregistrement FCM impossible :", err);
      }
    })();
  }, [userToken]);
}

/** Abonnement unique aux messages reçus quand l'application est au premier plan. */
export function useForegroundMessages(handler: (payload: MessagePayload) => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    getMessagingSafe().then((messaging) => {
      if (!messaging || cancelled) return;
      unsubscribe = onMessage(messaging, (payload) => handlerRef.current(payload));
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);
}

/** Affiche une notification système (utilisé quand l'onglet n'est pas visible). */
export async function showSystemNotification(payload: MessagePayload) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const title = payload.notification?.title || "Notification";
  const data = payload.data || {};
  const options = {
    body: payload.notification?.body || "",
    icon: "/favicon2.ico",
    badge: "/favicon2.ico",
    image: data.image || payload.notification?.image,
    data: { ...data, link: data.link || "/" },
  } as NotificationOptions;

  try {
    const registration = await navigator.serviceWorker?.getRegistration();
    if (registration) {
      await registration.showNotification(title, options);
      return;
    }
    new Notification(title, options);
  } catch (err) {
    console.warn("Affichage de la notification impossible :", err);
  }
}
