
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  areNotificationsEnabled, 
  requestNotificationPermission, 
  showNotification,
  toggleNotifications
} from '@/utils/notificationUtils';

type NotificationContextType = {
  notificationsEnabled: boolean;
  enableNotifications: () => Promise<boolean>;
  disableNotifications: () => void;
  sendNotification: (title: string, options?: NotificationOptions) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

  // Check notification status on mount
  useEffect(() => {
    setNotificationsEnabled(areNotificationsEnabled());
  }, []);

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

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        enableNotifications,
        disableNotifications,
        sendNotification
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
