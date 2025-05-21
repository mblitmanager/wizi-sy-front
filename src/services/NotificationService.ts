import { api } from './api';
import { BookOpen, Trophy, Bell, FileText } from 'lucide-react';

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  type: 'quiz' | 'formation' | 'badge' | 'system';
}

class NotificationService {
  isNotificationSupported(): boolean {
    return 'Notification' in window;
  }

  async getPermissionStatus(): Promise<NotificationPermission> {
    if (!this.isNotificationSupported()) {
      return 'denied';
    }
    return Notification.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isNotificationSupported()) {
      return 'denied';
    }
    return await Notification.requestPermission();
  }

  async sendNotification(title: string, options?: NotificationOptions): Promise<Notification | null> {
    if (!this.isNotificationSupported() || Notification.permission !== 'granted') {
      return null;
    }
    return new Notification(title, options);
  }

  async notifyQuizCompleted(score: number, totalQuestions: number): Promise<void> {
    const title = 'Quiz terminé !';
    const options = {
      body: `Vous avez obtenu ${score}/${totalQuestions} points !`,
      icon: FileText
    };
    await this.sendNotification(title, options);
  }

  async notifyQuizAvailable(quizTitle: string, quizId: string): Promise<void> {
    const title = 'Nouveau quiz disponible';
    const options = {
      body: `Un nouveau quiz "${quizTitle}" est disponible !`,
      icon: FileText
    };
    await this.sendNotification(title, options);
  }

  async notifyRewardEarned(points: number, rewardType?: string): Promise<void> {
    const title = 'Récompense obtenue !';
    const options = {
      body: `Vous avez gagné ${points} points${rewardType ? ` et un ${rewardType}` : ''} !`,
      icon: Trophy
    };
    await this.sendNotification(title, options);
  }

  async notifyFormationUpdate(formationTitle: string, formationId: string): Promise<void> {
    const title = 'Mise à jour de formation';
    const options = {
      body: `La formation "${formationTitle}" a été mise à jour !`,
      icon: BookOpen
    };
    await this.sendNotification(title, options);
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await api.get('/notifications');
      const notifications = response.data?.data || response.data?.notifications || response.data;
      return Array.isArray(notifications) ? notifications : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await api.post(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Erreur lors du marquage de la notification comme lue:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      await api.post('/notifications/mark-all-read');
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data.count;
    } catch (error) {
      console.error('Erreur lors de la récupération du nombre de notifications non lues:', error);
      return 0;
    }
  }
}

export const notificationService = new NotificationService();
