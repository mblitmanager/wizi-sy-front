import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationAPI } from "@/services/api";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface NotificationData {
  quiz_id?: string;
  quiz_title?: string;
  score?: number;
  total_questions?: number;
  points?: number;
  reward_type?: string;
  formation_id?: string;
  formation_title?: string;
  badge_id?: string;
  badge_name?: string;
  action?: string;
  media_id?: number;
  media_title?: string;
}

interface Notification {
  id: number;
  user_id: number;
  type: 'quiz' | 'formation' | 'badge' | 'media';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export function useNotifications() {
  const queryClient = useQueryClient();
  const previousNotificationsRef = useRef<Notification[]>([]);
  const navigate = useNavigate();

  const { data: notificationsData } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        console.log("Fetching notifications...");
        const response = await notificationAPI.getNotifications();
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
        return [];
      }
    },
    refetchInterval: 12000,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      try {
        const response = await notificationAPI.getUnreadCount();
        console.log("Fetching unread count...");
        return response.data.count || 0;
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre de notifications non lues:", error);
        return 0;
      }
    },
    refetchInterval: 12000,
  });

  // Vérifier les nouvelles notifications et afficher une notification push
  useEffect(() => {
    if (!notificationsData) return;

    const previousNotifications = previousNotificationsRef.current;
    const newNotifications = notificationsData.filter(
      (notification) => !previousNotifications.some((prev) => prev.id === notification.id)
    );

    if (newNotifications.length > 0) {
      // Demander la permission si ce n'est pas déjà fait
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }

      // Afficher une notification pour chaque nouvelle notification
      if (Notification.permission === "granted") {
        newNotifications.forEach(async (notification) => {
          try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(notification.title, {
              body: notification.message,
              icon: "/favicon.ico",
              tag: `notification-${notification.id}`,
              requireInteraction: true,
              data: {
                id: notification.id
              }
            });
          } catch (error) {
            console.error("Erreur lors de l'affichage de la notification:", error);
          }
        });
      }
    }

    // Mettre à jour la référence des notifications précédentes
    previousNotificationsRef.current = notificationsData;
  }, [notificationsData, navigate]);

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await notificationAPI.markAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await notificationAPI.markAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await notificationAPI.deleteNotification(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const notifications = notificationsData || [];

  return {
    notifications,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
  };
}
