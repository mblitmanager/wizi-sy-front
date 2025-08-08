// contexts/NotificationContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface NotificationContextType {
  notifications: any[];
  addNotification: (notification: any) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, notification]);
    toast(notification);
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
