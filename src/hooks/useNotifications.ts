
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';

interface NotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  vibrate?: number[];
  sound?: string;
  dir?: 'auto' | 'ltr' | 'rtl';
}

interface UseNotificationsReturn {
  notificationsEnabled: boolean;
  requestPermission: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<void>;
  notifyForNewQuiz: (quizTitle: string, category: string) => Promise<boolean>;
  notifyForQuizCompletion: (stagiaireId: string, quizTitle: string) => Promise<boolean>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast({
        title: 'Notifications non supportées',
        description: 'Votre navigateur ne supporte pas les notifications',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setNotificationsEnabled(granted);
      
      if (granted) {
        toast({
          title: 'Notifications activées',
          description: 'Vous recevrez des notifications pour les nouveaux quiz',
        });
      } else {
        toast({
          title: 'Notifications désactivées',
          description: 'Vous ne recevrez pas de notifications pour les nouveaux quiz',
          variant: 'destructive',
        });
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [toast]);

  const showNotification = async (title: string, options: NotificationOptions = {}): Promise<void> => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
    }

    try {
      // Use a standard options object without the renotify property
      const standardOptions: NotificationOptions = {
        ...options,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
      };

      const notification = new Notification(title, standardOptions);
      
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
      };
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  const notifyForNewQuiz = async (quizTitle: string, category: string): Promise<boolean> => {
    if (!notificationsEnabled) return false;
    
    try {
      await showNotification('Nouveau Quiz Disponible!', {
        body: `Un nouveau quiz "${quizTitle}" dans la catégorie "${category}" est disponible.`,
        data: { url: '/quizzes' },
      });
      return true;
    } catch (error) {
      console.error('Error sending quiz notification:', error);
      return false;
    }
  };

  const notifyForQuizCompletion = async (stagiaireId: string, quizTitle: string): Promise<boolean> => {
    if (!notificationsEnabled || stagiaireId === user?.id?.toString()) return false;
    
    try {
      await showNotification('Quiz terminé par un stagiaire!', {
        body: `Un stagiaire vient de terminer le quiz "${quizTitle}". Voulez-vous le tenter aussi?`,
        data: { url: '/quizzes' },
      });
      return true;
    } catch (error) {
      console.error('Error sending quiz completion notification:', error);
      return false;
    }
  };

  return {
    notificationsEnabled,
    requestPermission,
    showNotification,
    notifyForNewQuiz,
    notifyForQuizCompletion
  };
};
