import { useCallback } from "react";
import { toast } from "sonner";
import type { MessagePayload } from "firebase/messaging";
import { showSystemNotification, useFcmToken, useForegroundMessages } from "@/firebase-fcm";
import { useNotifications } from "@/hooks/useNotifications";
import { useUser } from "@/context/UserContext";

/**
 * Écoute les notifications FCM au premier plan :
 * - onglet visible → toast dans l'application
 * - onglet masqué → notification système
 * et les ajoute immédiatement à la liste locale.
 */
export default function NotificationListener() {
  const { pushLocal } = useNotifications();
  const { token } = useUser();

  useFcmToken(token);

  const handleMessage = useCallback(
    (payload: MessagePayload) => {
      const { title, body } = payload.notification || {};
      const data = payload.data || {};

      if (document.visibilityState === "visible") {
        toast(title || "Nouvelle notification", { description: body, duration: 5000 });
      } else {
        showSystemNotification(payload);
      }

      pushLocal({
        id: Number(data.id) || Date.now(),
        title,
        message: body || data.message || "",
        type: data.type || "system",
        created_at: data.created_at || new Date().toISOString(),
        data,
        read: false,
      });
    },
    [pushLocal]
  );

  useForegroundMessages(handleMessage);

  return null;
}
