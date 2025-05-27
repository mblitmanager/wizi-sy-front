import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/NotificationService';

export const NotificationBell: React.FC = () => {
  const { data: unreadCount = 0 } = useQuery<number>({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 60000, // Rafraîchir toutes les minutes
    staleTime: 30000, // Considérer les données comme fraîches pendant 30 secondes
    gcTime: 300000, // Garder en cache pendant 5 minutes
  });

  return (
    <Link to="/notifications">
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-gray-100 transition"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 text-xs bg-red-500 text-white animate-pulse">
            {unreadCount}
          </Badge>
        )}
      </Button>
    </Link>
  );
}; 