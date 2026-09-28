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
        <Button variant="ghost" size="icon" className="relative rounded-full transition-colors hover:bg-secondary" aria-label="Notifications">
          <Bell className="h-5 w-5 text-foreground/70" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center border-2 border-card bg-red-500 p-0 px-1 text-[10px] font-bold leading-none text-white hover:bg-red-500"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[22rem] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-border bg-popover p-0 shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="font-semibold text-foreground">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 rounded-full px-2.5 text-xs font-semibold text-accent-foreground hover:bg-accent">
              <Check className="h-3 w-3 mr-1" />
              Tout lire
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mb-2 text-3xl">📭</div>
              <p className="text-sm font-medium text-muted-foreground">Vous êtes à jour !</p>
            </div>
          ) : (
            <div className="divide-y divide-border/70">
              {notifications.slice(0, 10).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start gap-1 p-4 cursor-pointer transition-colors duration-200 focus:bg-secondary relative rounded-none ${!notification.read ? 'bg-accent/50' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  {!notification.read && (
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />
                  )}
                  <div className="flex w-full justify-between items-start mb-1">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {notification.title && (
                      <p className={`text-sm font-bold leading-tight ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </p>
                    )}
                    <p className={`text-xs leading-relaxed line-clamp-2 ${!notification.read ? 'text-foreground/80' : 'text-muted-foreground'}`}>
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
          className="group flex w-full items-center justify-center border-t border-border bg-secondary/60 px-4 py-3 text-xs font-semibold text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Voir toutes les notifications
          <ExternalLink className="h-3 w-3 ml-2 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
