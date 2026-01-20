import { Bell, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd MMM HH:mm", { locale: fr });
    } catch (e) {
      return "—";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "quiz": return "📝";
      case "formation": return "📚";
      case "badge": return "🏆";
      default: return "🔔";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-full">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 animate-pulse bg-blue-600 border-2 border-white dark:border-gray-900"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 border-none shadow-2xl bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
          <h4 className="font-bold text-gray-900 dark:text-white">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-[10px] h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold uppercase tracking-wider">
              <Check className="h-3 w-3 mr-1" />
              Tout lire
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mb-2 text-3xl">📭</div>
              <p className="text-sm text-gray-500 font-medium">Tout est lu !</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-700/30">
              {notifications.slice(0, 10).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start gap-1 p-4 cursor-pointer transition-colors duration-200 focus:bg-gray-50 dark:focus:bg-gray-700/40 relative ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  {!notification.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />
                  )}
                  <div className="flex w-full justify-between items-start mb-1">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {notification.title && (
                      <p className={`text-sm font-bold leading-tight ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {notification.title}
                      </p>
                    )}
                    <p className={`text-xs leading-relaxed line-clamp-2 ${!notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                      {notification.message}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <Link 
          to="/notifications" 
          className="flex items-center justify-center w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-xs font-bold text-gray-600 dark:text-gray-300 group"
        >
          Voir toutes les notifications
          <ExternalLink className="h-3 w-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
