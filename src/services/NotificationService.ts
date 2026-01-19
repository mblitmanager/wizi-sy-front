import { api } from "./api";
import { BookOpen, Trophy, FileText } from "lucide-react";

export interface ApiNotification {
  id: number;
  user_id: number;
  type: string;
  title?: string;
  message: string;
  data: Record<string, any> | null;
  read: boolean;
  created_at: string;
  updated_at: string;
}

class NotificationService {
  // Browser Notification API helpers
  isNotificationSupported(): boolean {
    return "Notification" in window;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isNotificationSupported()) {
      return "denied";
    }
    return await Notification.requestPermission();
  }

  async sendBrowserNotification(
    title: string,
    options?: NotificationOptions
  ): Promise<Notification | null> {
    if (
      !this.isNotificationSupported() ||
      Notification.permission !== "granted"
    ) {
      return null;
    }
    return new Notification(title, options);
  }

  // API Methods
  async getNotifications(): Promise<ApiNotification[]> {
    try {
      const response = await api.get("/notifications");
      // Laravel returns { data: [...] }
      const notifications = response.data?.data || [];
      return Array.isArray(notifications) ? notifications : [];
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      return [];
    }
  }

  async markAsRead(notificationId: number | string): Promise<void> {
    try {
      await api.post(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error(
        "Erreur lors du marquage de la notification comme lue:",
        error
      );
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await api.post("/notifications/mark-all-read");
    } catch (error) {
      console.error(
        "Erreur lors du marquage de toutes les notifications comme lues:",
        error
      );
      throw error;
    }
  }

  async deleteNotification(notificationId: number | string): Promise<void> {
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (error: any) {
      // Si la notification n'existe pas (404), on considère qu'elle est déjà supprimée
      if (error.response && error.response.status === 404) {
        return;
      }
      console.error("Erreur lors de la suppression de la notification:", error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get("/notifications/unread-count");
      return response.data.count;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du nombre de notifications non lues:",
        error
      );
      return 0;
    }
  }
}

export const notificationService = new NotificationService();
