/**
 * Utility functions for handling browser notifications
 */

// Check if browser supports notifications
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  
  // If permission is already granted or denied, return the current status
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  
  // Otherwise, ask for permission
  const permission = await Notification.requestPermission();
  return permission;
};

// Show a notification
export const showNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return null;
  }
  
  // Save the notification preference in local storage
  localStorage.setItem('notificationsEnabled', 'true');
  
  return new Notification(title, options);
};

// Check if notifications are enabled
export const areNotificationsEnabled = (): boolean => {
  if (!isNotificationSupported()) {
    return false;
  }
  
  return (
    Notification.permission === 'granted' &&
    localStorage.getItem('notificationsEnabled') === 'true'
  );
};

// Toggle notification preference
export const toggleNotifications = async (
  enabled: boolean
): Promise<boolean> => {
  if (!isNotificationSupported()) {
    return false;
  }
  
  if (enabled) {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      localStorage.setItem('notificationsEnabled', 'true');
      return true;
    }
    return false;
  } else {
    localStorage.setItem('notificationsEnabled', 'false');
    return false;
  }
};
