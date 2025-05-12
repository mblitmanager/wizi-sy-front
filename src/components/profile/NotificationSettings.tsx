
import React from 'react';
import { useNotificationContext } from '@/context/NotificationContext';
import { Bell, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

const NotificationSettings: React.FC = () => {
  const { notificationsEnabled, enableNotifications, disableNotifications, requestPermission } = useNotificationContext();

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const success = await requestPermission();
      if (success) {
        enableNotifications();
        toast({
          title: 'Notifications activées',
          description: 'Vous recevrez désormais des notifications de Wizi Learn.'
        });
      } else {
        toast({
          title: 'Permission refusée',
          description: 'Veuillez autoriser les notifications dans les paramètres de votre navigateur.',
          variant: 'destructive'
        });
      }
    } else {
      disableNotifications();
      toast({
        title: 'Notifications désactivées',
        description: 'Vous ne recevrez plus de notifications de Wizi Learn.'
      });
    }
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center space-x-3">
        {notificationsEnabled ? (
          <Bell className="h-5 w-5 text-blue-500" />
        ) : (
          <BellOff className="h-5 w-5 text-gray-500" />
        )}
        <div>
          <h3 className="font-medium font-montserrat">Notifications</h3>
          <p className="text-sm text-gray-500 font-nunito">
            {notificationsEnabled
              ? 'Vous recevrez des notifications sur vos quiz et badges'
              : 'Activer pour recevoir des notifications'}
          </p>
        </div>
      </div>
      <Switch
        checked={notificationsEnabled}
        onCheckedChange={handleToggleNotifications}
      />
    </div>
  );
};

export default NotificationSettings;
