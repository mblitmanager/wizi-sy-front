
import { NotificationServiceState } from './types';

export class NotificationPermissionService {
  private state: NotificationServiceState;

  constructor(state: NotificationServiceState) {
    this.state = state;
  }

  /**
   * Vérifie si les notifications sont supportées par le navigateur
   */
  isNotificationSupported(): boolean {
    return this.state.isSupported;
  }

  /**
   * Demande la permission pour afficher des notifications
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.state.isSupported) return 'denied';
    
    try {
      const permission = await Notification.requestPermission();
      this.state.permission = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Récupère le statut actuel des permissions
   */
  async getPermissionStatus(): Promise<NotificationPermission> {
    if (!this.state.isSupported) return 'denied';
    return this.state.permission;
  }
}
