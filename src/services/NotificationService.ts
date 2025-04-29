
type NotificationPermissionCallback = (permission: NotificationPermission) => void;

export class NotificationService {
  private static instance: NotificationService;
  private isSupported: boolean;
  
  constructor() {
    this.isSupported = 'Notification' in window;
  }
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
  
  isNotificationSupported(): boolean {
    return this.isSupported;
  }
  
  async requestPermission(callback?: NotificationPermissionCallback): Promise<NotificationPermission> {
    if (!this.isSupported) return 'denied';
    
    try {
      const permission = await Notification.requestPermission();
      if (callback) callback(permission);
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }
  
  async getPermissionStatus(): Promise<NotificationPermission> {
    if (!this.isSupported) return 'denied';
    return Notification.permission;
  }
  
  async sendNotification(title: string, options?: NotificationOptions): Promise<Notification | null> {
    if (!this.isSupported) return null;
    
    const permission = await this.getPermissionStatus();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }
    
    try {
      const notification = new Notification(title, options);
      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }
  
  // Notifications pour les événements spécifiques de l'application
  async notifyQuizCompleted(score: number, totalQuestions: number): Promise<void> {
    const scorePercentage = Math.round((score / totalQuestions) * 100);
    let message = '';
    let icon = '';
    
    if (scorePercentage >= 80) {
      message = `Bravo ! Vous avez obtenu ${score}/${totalQuestions} (${scorePercentage}%)`;
      icon = '/icons/trophy.png';
    } else if (scorePercentage >= 60) {
      message = `Bien joué ! Vous avez obtenu ${score}/${totalQuestions} (${scorePercentage}%)`;
      icon = '/icons/medal.png';
    } else {
      message = `Quiz terminé avec un score de ${score}/${totalQuestions} (${scorePercentage}%)`;
      icon = '/icons/quiz.png';
    }
    
    await this.sendNotification('Quiz terminé', {
      body: message,
      icon: icon,
      badge: '/icons/badge.png',
      vibrate: [200, 100, 200],
      tag: 'quiz-result',
      renotify: true
    });
  }
  
  async notifyQuizAvailable(quizTitle: string): Promise<void> {
    await this.sendNotification('Nouveau quiz disponible', {
      body: `Le quiz "${quizTitle}" est maintenant disponible`,
      icon: '/icons/notification.png',
      tag: 'quiz-available',
      renotify: true
    });
  }
  
  async notifyRewardEarned(points: number): Promise<void> {
    await this.sendNotification('Récompense gagnée', {
      body: `Vous avez gagné ${points} points !`,
      icon: '/icons/reward.png',
      tag: 'reward',
      renotify: true
    });
  }
}

export const notificationService = NotificationService.getInstance();
