
import { NotificationOptions, NotificationServiceState } from './types';
import { NotificationPermissionService } from './permissionService';
import { NotificationSender } from './notificationSender';
import { ServiceWorkerManager } from './serviceWorkerManager';

class NotificationService {
  private static instance: NotificationService;
  private state: NotificationServiceState;
  private permissionService: NotificationPermissionService;
  private sender: NotificationSender;
  
  constructor() {
    this.state = {
      permission: 'default',
      isSupported: 'Notification' in window,
      serviceWorkerRegistration: null
    };
    
    if (this.state.isSupported && Notification.permission) {
      this.state.permission = Notification.permission;
    }
    
    this.permissionService = new NotificationPermissionService(this.state);
    this.sender = new NotificationSender(this.state);
    
    this.initServiceWorker();
  }
  
  private async initServiceWorker() {
    this.state.serviceWorkerRegistration = await ServiceWorkerManager.initServiceWorker();
  }
  
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }
  
  // Méthodes de compatibilité avec l'ancien service
  isNotificationSupported(): boolean {
    return this.permissionService.isNotificationSupported();
  }
  
  async requestPermission(): Promise<NotificationPermission> {
    return this.permissionService.requestPermission();
  }
  
  async getPermissionStatus(): Promise<NotificationPermission> {
    return this.permissionService.getPermissionStatus();
  }
  
  async sendNotification(options: NotificationOptions): Promise<boolean> {
    return this.sender.send(options);
  }
  
  // Méthodes de notifications spécifiques
  async notifyQuizCompleted(quizTitle: string, score: number, totalQuestions: number): Promise<boolean> {
    return this.sender.sendQuizCompletion(quizTitle, score, totalQuestions);
  }
  
  async notifyNewQuiz(quizTitle: string, quizId: string, category: string): Promise<boolean> {
    return this.sender.sendNewQuiz(quizTitle, quizId, category);
  }
  
  async notifyUpcomingFormation(formationTitle: string, formationId: string, startDate: string): Promise<boolean> {
    return this.sender.sendUpcomingFormation(formationTitle, formationId, startDate);
  }
  
  async notifyReferralJoined(referralName: string): Promise<boolean> {
    return this.sender.sendReferralJoined(referralName);
  }
  
  async notifyReferralReward(amount: number): Promise<boolean> {
    return this.sender.sendReferralReward(amount);
  }
}

export const notificationService = NotificationService.getInstance();
export * from './types';
