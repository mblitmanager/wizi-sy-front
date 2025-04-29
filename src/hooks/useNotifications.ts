
import { useState, useEffect } from 'react';
import { notificationService } from '@/services/NotificationService';
import { useToast } from '@/hooks/use-toast';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const supported = notificationService.isNotificationSupported();
    setIsSupported(supported);
    
    if (supported) {
      notificationService.getPermissionStatus().then(status => {
        setPermission(status);
      });
    }
  }, []);
  
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      toast({
        title: "Non supporté",
        description: "Votre navigateur ne prend pas en charge les notifications.",
        variant: "destructive"
      });
      return 'denied';
    }
    
    try {
      const result = await notificationService.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Notifications activées",
          description: "Vous recevrez maintenant des notifications pour les événements importants.",
          variant: "default"
        });
      } else {
        toast({
          title: "Notifications refusées",
          description: "Vous ne recevrez pas de notifications pour les événements importants.",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error requesting permission:', error);
      toast({
        title: "Erreur",
        description: "Impossible de demander l'autorisation pour les notifications.",
        variant: "destructive"
      });
      return 'denied';
    }
  };
  
  const sendNotification = async (title: string, options?: NotificationOptions): Promise<boolean> => {
    // Check if permission is not granted and try to request it
    if (permission !== 'granted') {
      const newPermission = await requestPermission();
      // If permission is still not granted after request, return false
      if (newPermission !== 'granted') return false;
    }
    
    const notification = await notificationService.sendNotification(title, options);
    return notification !== null;
  };
  
  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    notifyQuizCompleted: notificationService.notifyQuizCompleted.bind(notificationService),
    notifyQuizAvailable: notificationService.notifyQuizAvailable.bind(notificationService),
    notifyRewardEarned: notificationService.notifyRewardEarned.bind(notificationService)
  };
}
