
import { useState, useEffect } from 'react';
import { notificationService } from '@/services/NotificationService';

export interface UseNotificationsReturn {
  notificationsEnabled: boolean;
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<boolean>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<boolean>;
  notifyForNewQuiz: (quizTitle: string, quizId: string, category: string) => Promise<boolean>;
  notifyForQuizCompletion: (stagiaireId: string, quizTitle: string) => Promise<boolean>;
  notifyQuizCompleted: (quizTitle: string, score: number, totalQuestions: number) => Promise<boolean>;
  notifyForUpcomingFormation: (formationTitle: string, formationId: string, startDate: string) => Promise<boolean>;
  notifyReferralJoined: (referralName: string) => Promise<boolean>;
  notifyReferralReward: (amount: number) => Promise<boolean>;
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
      const supported = notificationService.isNotificationSupported();
      setIsSupported(supported);
      
      if (supported) {
        const currentPermission = await notificationService.getPermissionStatus();
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
      const result = await notificationService.requestPermission();
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
  
  const showNotification = async (title: string, options?: NotificationOptions): Promise<boolean> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return false;
    
    try {
      return await notificationService.sendNotification({
        title,
        body: options?.body || '',
        icon: options?.icon,
        data: options?.data,
        tag: options?.tag
      });
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  };
  
  const notifyForNewQuiz = async (quizTitle: string, quizId: string, category: string): Promise<boolean> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return false;
    return await notificationService.notifyNewQuiz(quizTitle, quizId, category);
  };
  
  const notifyForUpcomingFormation = async (formationTitle: string, formationId: string, startDate: string): Promise<boolean> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return false;
    return await notificationService.notifyUpcomingFormation(formationTitle, formationId, startDate);
  };
  
  const notifyForQuizCompletion = async (stagiaireId: string, quizTitle: string): Promise<boolean> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return false;
    
    try {
      await showNotification(`Quiz terminé par un autre apprenant`, {
        body: `Un autre apprenant a terminé le quiz: ${quizTitle}`
      });
      return true;
    } catch (error) {
      console.error('Error notifying for quiz completion:', error);
      return false;
    }
  };

  const notifyQuizCompleted = async (quizTitle: string, score: number, totalQuestions: number): Promise<boolean> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return false;
    return await notificationService.notifyQuizCompleted(quizTitle, score, totalQuestions);
  };
  
  const notifyReferralJoined = async (referralName: string): Promise<boolean> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return false;
    return await notificationService.notifyReferralJoined(referralName);
  };
  
  const notifyReferralReward = async (amount: number): Promise<boolean> => {
    if (!isSupported || !notificationsEnabled || permission !== 'granted') return false;
    return await notificationService.notifyReferralReward(amount);
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
    notifyForUpcomingFormation,
    notifyReferralJoined,
    notifyReferralReward,
    enableNotifications,
    disableNotifications
  };
};
