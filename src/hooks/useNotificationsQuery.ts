import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";

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
}

interface Notification {
  id: number;
  user_id: number;
  type: string;
  message: string;
  data: NotificationData;
  read: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  data: Notification[];
}

export function useNotificationsQuery() {
  const queryClient = useQueryClient();

  const { data: notificationsData } = useQuery<ApiResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const response = await api.get<ApiResponse>("/notifications");
        return response.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des notifications:", error);
        return { data: [] };
      }
    },
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      try {
        const response = await api.get("/notifications/unread-count");
        return response.data.count || 0;
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre de notifications non lues:", error);
        return 0;
      }
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await api.post("/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  // S'assurer que notifications est toujours un tableau
  const notifications = notificationsData?.data || [];

  return {
    notifications,
    unreadCount,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
  };
}

export default useNotificationsQuery;
