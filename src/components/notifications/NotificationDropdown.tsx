import { Bell } from "lucide-react";
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

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMM yyyy 'à' HH:mm", { locale: fr });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return "📝";
      case "formation":
        return "📚";
      case "badge":
        return "🏆";
      case "system":
        return "🔔";
      default:
        return "📌";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsRead()}
              className="text-xs"
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-2 p-3 cursor-pointer hover:bg-accent"
                onClick={() => !notification.read && markAsRead(notification.id)}
              >
                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1 space-y-1">
                  {notification.title && (
                    <p className="text-sm font-semibold leading-none text-gray-900">
                      {notification.title}
                    </p>
                  )}
                  <p className="text-sm font-medium leading-none text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(notification.created_at)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 