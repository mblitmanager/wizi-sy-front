import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationAPI } from "@/services/api";

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
    refetchInterval: 12000, // Polling toutes les 5 secondes
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
    refetchInterval: 12000, // Polling toutes les 5 secondes
  });

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

  // S'assurer que notifications est toujours un tableau
  const notifications = notificationsData || [];

  return {
    notifications,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
  };
}
