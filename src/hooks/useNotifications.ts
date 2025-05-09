
import { useState, useEffect } from 'react';
import { notificationService } from '@/services/NotificationService';
import { useToast } from '@/hooks/use-toast';
import useLocalStorage from '@/hooks/useLocalStorage';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [settings, setSettings] = useLocalStorage('notification-settings', {
    quizCompleted: true, 
    quizAvailable: true, 
    rewardEarned: true,
    formationUpdates: true,
    peerActivity: true
  });
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
        
        // Send a welcome notification
        await notificationService.sendNotification(
          "Notifications Wizi-Learn activées",
          { 
            body: "Vous serez informé des nouveaux quiz et des activités de votre formation.",
            icon: "/icons/notification.png"
          }
        );
      } else if (result === 'denied') {
        toast({
          title: "Notifications refusées",
          description: "Vous ne recevrez pas de notifications pour les événements importants.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "En attente",
          description: "Veuillez accorder l'autorisation dans votre navigateur pour recevoir des notifications.",
          variant: "default"
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

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    setSettings({...settings, ...newSettings});
  };
  
  const notifyQuizCompleted = async (score: number, totalQuestions: number): Promise<void> => {
    if (permission === 'granted' && settings.quizCompleted) {
      return notificationService.notifyQuizCompleted(score, totalQuestions);
    }
  };

  const notifyQuizAvailable = async (quizTitle: string, quizId: string): Promise<void> => {
    if (permission === 'granted' && settings.quizAvailable) {
      return notificationService.notifyQuizAvailable(quizTitle, quizId);
    }
  };

  const notifyPeerActivity = async (peerName: string, quizTitle: string): Promise<void> => {
    if (permission === 'granted' && settings.peerActivity) {
      const options: NotificationOptions = {
        body: `${peerName} vient de terminer le quiz "${quizTitle}"`,
        icon: '/icons/activity.png',
        tag: 'peer-activity',
        renotify: true,
      };
      
      await notificationService.sendNotification('Activité de formation', options);
    }
  };

  const notifyRewardEarned = async (points: number, rewardType?: string): Promise<void> => {
    if (permission === 'granted' && settings.rewardEarned) {
      return notificationService.notifyRewardEarned(points, rewardType);
    }
  };

  const notifyFormationUpdate = async (formationTitle: string, formationId: string): Promise<void> => {
    if (permission === 'granted' && settings.formationUpdates) {
      return notificationService.notifyFormationUpdate(formationTitle, formationId);
    }
  };
  
  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    settings,
    updateSettings,
    notifyQuizCompleted,
    notifyQuizAvailable,
    notifyPeerActivity,
    notifyRewardEarned,
    notifyFormationUpdate
  };
}

export default useNotifications;
