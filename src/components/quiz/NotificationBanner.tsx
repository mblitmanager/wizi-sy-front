
import React from 'react';
import useNotifications from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface NotificationBannerProps {
  className?: string;
}

export function NotificationBanner({ className }: NotificationBannerProps) {
  const { permission, isSupported, requestPermission } = useNotifications();

  // Ne pas afficher la bannière si les notifications ne sont pas supportées
  // ou si l'autorisation a déjà été accordée
  if (!isSupported || permission === 'granted') {
    return null;
  }

  return (
    <Card className={`p-3 sm:p-4 bg-blue-50 border-blue-200 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-2 sm:gap-3">
          <Bell className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800 text-sm sm:text-base">Activez les notifications</h3>
            <p className="text-xs sm:text-sm text-blue-600">
              Recevez des notifications pour les nouveaux quiz, récompenses et résultats.
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={requestPermission}
          className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
        >
          Activer
        </Button>
      </div>
    </Card>
  );
}
