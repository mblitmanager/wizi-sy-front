
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  areNotificationsEnabled, 
  requestNotificationPermission, 
  showNotification,
  toggleNotifications
} from '@/utils/notificationUtils';
import { useToast } from '@/hooks/use-toast';

type NotificationContextType = {
  notificationsEnabled: boolean;
  enableNotifications: () => Promise<boolean>;
  disableNotifications: () => void;
  sendNotification: (title: string, options?: NotificationOptions) => void;
  requestPermission: () => Promise<boolean>;
  notifyForNewQuiz: (quizTitle: string, quizId: string) => Promise<void>;
  notifyForPeerActivity: (peerName: string, quizTitle: string) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const { toast } = useToast();

  // Check notification status on mount
  useEffect(() => {
    setNotificationsEnabled(areNotificationsEnabled());
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const permission = await requestNotificationPermission();
      const enabled = permission === 'granted';
      setNotificationsEnabled(enabled);
      
      if (enabled) {
        toast({
          title: 'Notifications activées',
          description: 'Vous recevrez des notifications pour les nouveaux quiz et activités.'
        });
      } else {
        toast({
          title: 'Notifications désactivées',
          description: 'Vous ne recevrez pas de notifications pour les mises à jour.',
          variant: 'destructive'
        });
      }
      
      return enabled;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [toast]);

  // Function to enable notifications
  const enableNotifications = async (): Promise<boolean> => {
    const success = await toggleNotifications(true);
    setNotificationsEnabled(success);
    
    if (success) {
      showNotification('Notifications activées', {
        body: 'Vous recevrez désormais des notifications de Wizi Learn.',
        icon: '/favicon.ico'
      });
    }
    
    return success;
  };

  // Function to disable notifications
  const disableNotifications = () => {
    toggleNotifications(false);
    setNotificationsEnabled(false);
  };

  // Function to send a notification
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (notificationsEnabled) {
      showNotification(title, options);
    }
  };
  
  // Specialized notification for new quizzes
  const notifyForNewQuiz = async (quizTitle: string, quizId: string): Promise<void> => {
    if (!notificationsEnabled) return;
    
    sendNotification('Nouveau quiz disponible', {
      body: `"${quizTitle}" est maintenant disponible pour votre formation.`,
      icon: '/icons/quiz.png',
      tag: 'new-quiz',
      data: { quizId, type: 'new-quiz' }
    });
  };
  
  // Specialized notification for peer activity
  const notifyForPeerActivity = async (peerName: string, quizTitle: string): Promise<void> => {
    if (!notificationsEnabled) return;
    
    sendNotification('Activité de formation', {
      body: `${peerName} vient de terminer le quiz "${quizTitle}"`,
      icon: '/icons/activity.png',
      tag: 'peer-activity',
      data: { type: 'peer-activity' }
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        enableNotifications,
        disableNotifications,
        sendNotification,
        requestPermission,
        notifyForNewQuiz,
        notifyForPeerActivity
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
