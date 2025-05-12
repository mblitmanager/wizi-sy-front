
import React, { createContext, useContext } from 'react';
import { useNotifications, UseNotificationsReturn } from '@/hooks/useNotifications';

// This type now uses the full return type from useNotifications
type NotificationContextType = UseNotificationsReturn;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotifications();
  
  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
