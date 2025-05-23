
type NotificationPermissionCallback = (permission: NotificationPermission) => void;

interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  renotify?: boolean;
  badge?: string;
  data?: any;
}

export class NotificationService {
  private static instance: NotificationService;
  private isSupported: boolean;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  
  constructor() {
    this.isSupported = 'Notification' in window;
    this.initServiceWorker();
  }
  
  private async initServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/service-worker.js');
        // console.log('Service Worker enregistré avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
      }
    }
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
  
  async sendNotification(title: string, options?: ExtendedNotificationOptions): Promise<Notification | null> {
    if (!this.isSupported) return null;
    
    const permission = await this.getPermissionStatus();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }
    
    try {
      // Utiliser le service worker si disponible
      if (this.serviceWorkerRegistration && 'showNotification' in this.serviceWorkerRegistration) {
        await this.serviceWorkerRegistration.showNotification(title, options);
        return null; // La notification est gérée par le service worker
      } else {
        // Fallback à la notification standard
        const notification = new Notification(title, options as NotificationOptions);
        return notification;
      }
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
      message = `Bravo ! Vous avez obtenu ${score*2}/${totalQuestions*2} points (${scorePercentage}%)`;
      icon = '/icons/trophy.png';
    } else if (scorePercentage >= 60) {
      message = `Bien joué ! Vous avez obtenu ${score*2}/${totalQuestions*2} points (${scorePercentage}%)`;
      icon = '/icons/medal.png';
    } else {
      message = `Quiz terminé avec un score de ${score*2}/${totalQuestions*2} points (${scorePercentage}%)`;
      icon = '/icons/quiz.png';
    }
    
    const options: ExtendedNotificationOptions = {
      body: message,
      icon: icon,
      badge: '/icons/badge.png',
      vibrate: [200, 100, 200],
      tag: 'quiz-result',
      renotify: true,
      data: {
        type: 'quiz-completed',
        score,
        totalQuestions,
        percentage: scorePercentage
      }
    };
    
    await this.sendNotification('Quiz terminé', options);
  }
  
  async notifyQuizAvailable(quizTitle: string, quizId: string): Promise<void> {
    const options: ExtendedNotificationOptions = {
      body: `Le quiz "${quizTitle}" est maintenant disponible`,
      icon: '/icons/notification.png',
      tag: 'quiz-available',
      renotify: true,
      data: {
        type: 'quiz-available',
        quizId,
        quizTitle
      }
    };
    
    await this.sendNotification('Nouveau quiz disponible', options);
  }
  
  async notifyRewardEarned(points: number, rewardType?: string): Promise<void> {
    const rewardMessage = rewardType 
      ? `Vous avez gagné ${points} points pour : ${rewardType}`
      : `Vous avez gagné ${points} points !`;
      
    const options: ExtendedNotificationOptions = {
      body: rewardMessage,
      icon: '/icons/reward.png',
      tag: 'reward',
      renotify: true,
      data: {
        type: 'reward-earned',
        points,
        rewardType
      }
    };
    
    await this.sendNotification('Récompense gagnée', options);
  }
  
  async notifyFormationUpdate(formationTitle: string, formationId: string): Promise<void> {
    const options: ExtendedNotificationOptions = {
      body: `La formation "${formationTitle}" a été mise à jour.`,
      icon: '/icons/formation.png',
      tag: 'formation-update',
      renotify: true,
      data: {
        type: 'formation-update',
        formationId,
        formationTitle
      }
    };
    
    await this.sendNotification('Mise à jour de formation', options);
  }
  
  async scheduleNotification(title: string, body: string, delay: number): Promise<void> {
    setTimeout(() => {
      this.sendNotification(title, { body });
    }, delay);
  }
}

export const notificationService = NotificationService.getInstance();
