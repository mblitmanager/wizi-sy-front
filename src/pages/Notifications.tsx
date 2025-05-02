
import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Trash2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'quiz' | 'formation' | 'reward' | 'system';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nouveau quiz disponible',
    message: 'Un nouveau quiz sur le développement web est disponible !',
    date: '2025-05-01T10:30:00',
    read: false,
    type: 'quiz'
  },
  {
    id: '2',
    title: 'Félicitations !',
    message: 'Vous avez terminé votre formation React avec succès.',
    date: '2025-04-30T15:45:00',
    read: true,
    type: 'formation'
  },
  {
    id: '3',
    title: 'Points gagnés',
    message: 'Vous avez gagné 50 points pour avoir complété votre quiz.',
    date: '2025-04-29T09:15:00',
    read: true,
    type: 'reward'
  }
];

const Notifications: React.FC = () => {
  const { settings, updateSettings } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const filterNotifications = () => {
    if (activeTab === 'all') {
      return notifications;
    }
    return notifications.filter(notif => notif.type === activeTab);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredNotifications = filterNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 
                  ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}.` 
                  : 'Toutes les notifications ont été lues.'}
              </p>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
                disabled={!notifications.some(n => !n.read)}
              >
                Tout marquer comme lu
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={deleteAllNotifications}
                disabled={notifications.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer tout
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <div className="overflow-x-auto">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                  <TabsTrigger value="quiz">Quiz</TabsTrigger>
                  <TabsTrigger value="formation">Formations</TabsTrigger>
                  <TabsTrigger value="reward">Récompenses</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="mt-0">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <NotificationCard 
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </TabsContent>
              
              <TabsContent value="quiz" className="mt-0">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <NotificationCard 
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </TabsContent>
              
              <TabsContent value="formation" className="mt-0">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <NotificationCard 
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </TabsContent>
              
              <TabsContent value="reward" className="mt-0">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <NotificationCard 
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={markAsRead}
                        onDelete={deleteNotification}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> Paramètres des notifications
                </CardTitle>
                <CardDescription>
                  Configurez quels types de notifications vous souhaitez recevoir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="quiz-completed">Quiz terminés</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications lorsque vous terminez un quiz
                      </p>
                    </div>
                    <Switch 
                      id="quiz-completed" 
                      checked={settings.quizCompleted} 
                      onCheckedChange={(checked) => updateSettings({ quizCompleted: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="quiz-available">Nouveaux quiz</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications lorsque de nouveaux quiz sont disponibles
                      </p>
                    </div>
                    <Switch 
                      id="quiz-available" 
                      checked={settings.quizAvailable} 
                      onCheckedChange={(checked) => updateSettings({ quizAvailable: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reward-earned">Récompenses</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications lorsque vous gagnez des points ou des badges
                      </p>
                    </div>
                    <Switch 
                      id="reward-earned" 
                      checked={settings.rewardEarned} 
                      onCheckedChange={(checked) => updateSettings({ rewardEarned: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="formation-updates">Formations</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications concernant vos formations
                      </p>
                    </div>
                    <Switch 
                      id="formation-updates" 
                      checked={settings.formationUpdates} 
                      onCheckedChange={(checked) => updateSettings({ formationUpdates: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 border border-dashed rounded-lg">
      <Bell className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="font-medium mb-1">Aucune notification</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        Vous n'avez pas encore de notifications dans cette catégorie.
      </p>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkAsRead, onDelete }) => {
  const { id, title, message, date, read, type } = notification;
  
  const getTypeIcon = () => {
    switch (type) {
      case 'quiz':
        return <div className="bg-blue-100 p-2 rounded-full"><Bell className="h-4 w-4 text-blue-500" /></div>;
      case 'formation':
        return <div className="bg-green-100 p-2 rounded-full"><Bell className="h-4 w-4 text-green-500" /></div>;
      case 'reward':
        return <div className="bg-yellow-100 p-2 rounded-full"><Bell className="h-4 w-4 text-yellow-500" /></div>;
      default:
        return <div className="bg-gray-100 p-2 rounded-full"><Bell className="h-4 w-4 text-gray-500" /></div>;
    }
  };
  
  return (
    <Card className={`${!read ? 'bg-blue-50/30 border-blue-200' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {getTypeIcon()}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
              <h3 className={`font-medium ${!read ? 'text-blue-800' : ''}`}>{title}</h3>
              <span className="text-xs text-muted-foreground">{formatDate(date)}</span>
            </div>
            <p className="text-sm mt-1">{message}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 bg-muted/30 flex justify-end gap-2">
        {!read && (
          <Button variant="ghost" size="sm" onClick={() => onMarkAsRead(id)}>
            Marquer comme lu
          </Button>
        )}
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Notifications;
