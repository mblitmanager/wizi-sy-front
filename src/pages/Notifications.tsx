
import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Settings, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationBanner } from "@/components/quiz/NotificationBanner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  type: 'quiz' | 'formation' | 'referral' | 'system';
  url?: string;
}

const NotificationsPage = () => {
  const { isSupported, permission, requestPermission, notificationsEnabled, enableNotifications, disableNotifications } = useNotifications();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [statusMessage, setStatusMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  
  useEffect(() => {
    // This would typically fetch notifications from a backend API
    // For now, we're using mock data
    const mockNotifications: NotificationItem[] = [
      {
        id: '1',
        title: 'Nouveau Quiz Disponible',
        body: 'Le quiz "Introduction à React" est maintenant disponible!',
        date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
        read: false,
        type: 'quiz',
        url: '/quiz/123'
      },
      {
        id: '2',
        title: 'Formation bientôt disponible',
        body: 'La formation "JavaScript Avancé" commence le 20 mai à 10h00',
        date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
        read: true,
        type: 'formation',
        url: '/formations/456'
      },
      {
        id: '3',
        title: 'Nouveau Filleul',
        body: 'Pierre s\'est inscrit grâce à votre parrainage!',
        date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 days ago
        read: false,
        type: 'referral',
        url: '/profile'
      },
      {
        id: '4',
        title: 'Quiz Terminé',
        body: 'Vous avez obtenu un score de 8/10 (80%)',
        date: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(), // 1 week ago
        read: true,
        type: 'quiz',
        url: '/quiz/789/results'
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);
  
  // Show a status message temporarily
  const showStatusMessage = (text: string, type: 'success' | 'error') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };
  
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const handleNotificationClick = (notification: NotificationItem) => {
    markAsRead(notification.id);
    
    if (notification.url) {
      window.location.href = notification.url;
    }
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    showStatusMessage("Toutes les notifications ont été supprimées", "success");
  };
  
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
    showStatusMessage("Toutes les notifications ont été marquées comme lues", "success");
  };
  
  const toggleNotifications = () => {
    if (notificationsEnabled) {
      disableNotifications();
      showStatusMessage("Notifications désactivées", "success");
    } else {
      if (permission !== 'granted') {
        requestPermission();
      } else {
        enableNotifications();
        showStatusMessage("Notifications activées", "success");
      }
    }
  };
  
  const filteredNotifications = activeTab === 'all'
    ? notifications
    : notifications.filter(notification => notification.type === activeTab);
    
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-4xl py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearAllNotifications} disabled={notifications.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Effacer tout
            </Button>
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Bell className="h-4 w-4 mr-2" />
              Marquer comme lu
            </Button>
          </div>
        </div>
        
        {/* Status message */}
        {statusMessage && (
          <div className={`p-3 mb-4 rounded-md ${
            statusMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {statusMessage.text}
          </div>
        )}
        
        {!isSupported && (
          <Card className="mb-6 bg-orange-50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <BellOff className="h-12 w-12 text-orange-500 mb-2" />
                <h2 className="text-xl font-semibold text-orange-700">Notifications non supportées</h2>
                <p className="text-orange-600 mt-2">
                  Votre navigateur ne prend pas en charge les notifications push. 
                  Essayez d'utiliser un navigateur plus récent comme Chrome, Firefox ou Edge.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {isSupported && permission !== 'granted' && (
          <NotificationBanner className="mb-6" />
        )}
        
        {isSupported && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
              <CardDescription>Configurez comment vous souhaitez recevoir les notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications push</p>
                  <p className="text-sm text-gray-500">
                    {notificationsEnabled ? 'Notifications activées' : 'Notifications désactivées'}
                  </p>
                </div>
                <Switch 
                  checked={notificationsEnabled} 
                  onCheckedChange={toggleNotifications} 
                  disabled={permission !== 'granted' && !notificationsEnabled}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <p className="text-sm text-gray-500">
                {permission === 'granted' 
                  ? 'Vous avez autorisé les notifications pour ce site'
                  : permission === 'denied'
                    ? 'Vous avez bloqué les notifications pour ce site'
                    : 'Autorisez les notifications pour être informé des nouveaux quiz et formations'
                }
              </p>
              {permission !== 'granted' && (
                <Button variant="outline" size="sm" onClick={requestPermission}>
                  <Bell className="h-4 w-4 mr-2" />
                  Autoriser
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">
                Tous
                {unreadCount > 0 && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>}
              </TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
              <TabsTrigger value="formation">Formations</TabsTrigger>
              <TabsTrigger value="referral">Parrainage</TabsTrigger>
              <TabsTrigger value="system">Système</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-400">Aucune notification</h3>
                <p className="text-gray-400 mt-2">
                  Vous n'avez pas de notification {activeTab !== 'all' ? `dans la catégorie ${activeTab}` : ''}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map(notification => (
                  <Card 
                    key={notification.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${notification.read ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-semibold ${notification.read ? '' : 'text-blue-700'}`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${notification.read ? 'text-gray-600' : 'text-blue-600'}`}>
                            {notification.body}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">
                          {new Date(notification.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {notification.type === 'quiz' && 'Quiz'}
                          {notification.type === 'formation' && 'Formation'}
                          {notification.type === 'referral' && 'Parrainage'}
                          {notification.type === 'system' && 'Système'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
