
import { useState, useEffect } from 'react';

export interface UseNotificationsReturn {
  notificationsEnabled: boolean;
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<void>;
  notifyForNewQuiz: (quizTitle: string, category: string) => Promise<boolean>;
  notifyForQuizCompletion: (stagiaireId: string, quizTitle: string) => Promise<boolean>;
  notifyQuizCompleted: (quizTitle: string, score: number) => Promise<boolean>;
  enableNotifications: () => void;
  disableNotifications: () => void;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  
  // Check if notifications are supported and get initial permission
  useEffect(() => {
    const checkSupport = async () => {
      const supported = 'Notification' in window;
      setIsSupported(supported);
      
      if (supported) {
        const currentPermission = Notification.permission;
        setPermission(currentPermission);
        
        // Check if notifications are enabled in localStorage
        const enabled = localStorage.getItem('notifications_enabled') === 'true';
        setNotificationsEnabled(currentPermission === 'granted' && enabled);
      }
    };
    
    checkSupport();
  }, []);

  const enableNotifications = () => {
    localStorage.setItem('notifications_enabled', 'true');
    setNotificationsEnabled(permission === 'granted');
  };

  const disableNotifications = () => {
    localStorage.setItem('notifications_enabled', 'false');
    setNotificationsEnabled(false);
  };
  
  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        enableNotifications();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };
  
  const showNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return;
    
    try {
      const notification = new Notification(title, options);
      
      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };
  
  const notifyForNewQuiz = async (quizTitle: string, category: string): Promise<boolean> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return false;
    
    try {
      await showNotification(`Nouveau Quiz: ${quizTitle}`, {
        body: `Un nouveau quiz dans la catégorie ${category} est disponible!`,
        icon: '/favicon.ico'
      });
      return true;
    } catch (error) {
      console.error('Error notifying for new quiz:', error);
      return false;
    }
  };
  
  const notifyForQuizCompletion = async (stagiaireId: string, quizTitle: string): Promise<boolean> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return false;
    
    try {
      await showNotification(`Quiz terminé par un autre apprenant`, {
        body: `Un autre apprenant a terminé le quiz: ${quizTitle}`,
        icon: '/favicon.ico'
      });
      return true;
    } catch (error) {
      console.error('Error notifying for quiz completion:', error);
      return false;
    }
  };

  const notifyQuizCompleted = async (quizTitle: string, score: number): Promise<boolean> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return false;
    
    try {
      await showNotification(`Quiz Terminé: ${quizTitle}`, {
        body: `Vous avez terminé le quiz avec un score de ${score}%`,
        icon: '/favicon.ico'
      });
      return true;
    } catch (error) {
      console.error('Error sending quiz completion notification:', error);
      return false;
    }
  };
  
  return {
    notificationsEnabled,
    permission,
    isSupported,
    requestPermission,
    showNotification,
    notifyForNewQuiz,
    notifyForQuizCompletion,
    notifyQuizCompleted,
    enableNotifications,
    disableNotifications
  };
};
