
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications as useNotificationsHook } from '@/hooks/useNotifications';

interface NotificationContextType {
  notificationsEnabled: boolean;
  requestPermission: () => Promise<boolean>;
  showNotification: (title: string, options?: any) => Promise<void>;
  notifyForNewQuiz: (quizTitle: string, category: string) => Promise<boolean>;
  notifyForQuizCompletion: (stagiaireId: string, quizTitle: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notifications = useNotificationsHook();
  
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
