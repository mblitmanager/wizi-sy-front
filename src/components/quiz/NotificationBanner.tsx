
import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface NotificationBannerProps {
  className?: string;
}

export function NotificationBanner({ className }: NotificationBannerProps) {
  const { permission, isSupported, requestPermission } = useNotifications();

  if (!isSupported) {
    return null;
  }

  if (permission === 'granted') {
    return null;
  }

  return (
    <Card className={`p-4 bg-blue-50 border-blue-200 mb-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Activez les notifications</h3>
            <p className="text-sm text-blue-600">
              Recevez des notifications pour les nouveaux quiz, récompenses et résultats.
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={requestPermission}
          className="border-blue-300 bg-white text-blue-700 hover:bg-blue-50"
        >
          Activer
        </Button>
      </div>
    </Card>
  );
}
