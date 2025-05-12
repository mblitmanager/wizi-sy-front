
import React, { createContext, useContext } from 'react';
import { useNotifications as useNotificationsHook, UseNotificationsReturn } from '@/hooks/useNotifications';

// This type now uses the full return type from useNotifications
type NotificationContextType = UseNotificationsReturn;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotificationsHook();
  
  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

// Re-export for backward compatibility
export { useNotificationsHook as useNotifications };
