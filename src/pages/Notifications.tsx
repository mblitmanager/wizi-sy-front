import { Layout } from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shell } from "@/components/ui/shell";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

// Ajouter la fonction formatDate manquante
function formatDate(date: string | Date): string {
  if (!date) return '';
  
  try {
    return format(new Date(date), 'dd/MM/yyyy HH:mm');
  } catch (e) {
    console.error("Error formatting date:", e);
    return String(date);
  }
}

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
}

const Notifications = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fetching notifications from an API
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Replace this with your actual API call
        const mockNotifications: Notification[] = [
          {
            id: "1",
            type: "quiz",
            title: "Nouveau Quiz Disponible",
            description: "Un nouveau quiz sur JavaScript a été ajouté.",
            read: false,
            createdAt: "2024-07-15T10:30:00Z",
          },
          {
            id: "2",
            type: "formation",
            title: "Nouvelle Formation Disponible",
            description: "Une nouvelle formation sur React est disponible.",
            read: true,
            createdAt: "2024-07-14T15:45:00Z",
          },
          {
            id: "3",
            type: "general",
            title: "Mise à jour de la Plateforme",
            description: "La plateforme a été mise à jour avec de nouvelles fonctionnalités.",
            read: false,
            createdAt: "2024-07-13T09:00:00Z",
          },
          {
            id: "4",
            type: "quiz",
            title: "Résultats du Quiz",
            description: "Vos résultats pour le quiz sur HTML sont disponibles.",
            read: true,
            createdAt: "2024-07-12T18:20:00Z",
          },
          {
            id: "5",
            type: "formation",
            title: "Progrès de la Formation",
            description: "Vous avez terminé 50% de la formation sur Node.js.",
            read: false,
            createdAt: "2024-07-11T12:10:00Z",
          },
          {
            id: "6",
            type: "general",
            title: "Bienvenue sur la Plateforme",
            description: "Bienvenue sur notre plateforme de formation en ligne!",
            read: true,
            createdAt: "2024-07-10T16:55:00Z",
          },
          {
            id: "7",
            type: "quiz",
            title: "Nouveau Quiz Disponible",
            description: "Un nouveau quiz sur CSS a été ajouté.",
            read: false,
            createdAt: "2024-07-09T11:40:00Z",
          },
          {
            id: "8",
            type: "formation",
            title: "Nouvelle Formation Disponible",
            description: "Une nouvelle formation sur Angular est disponible.",
            read: true,
            createdAt: "2024-07-08T14:30:00Z",
          },
          {
            id: "9",
            type: "general",
            title: "Maintenance de la Plateforme",
            description: "La plateforme sera en maintenance le 20 juillet de 00h00 à 06h00.",
            read: false,
            createdAt: "2024-07-07T08:25:00Z",
          },
          {
            id: "10",
            type: "quiz",
            title: "Résultats du Quiz",
            description: "Vos résultats pour le quiz sur React sont disponibles.",
            read: true,
            createdAt: "2024-07-06T17:15:00Z",
          },
        ];

        setNotifications(mockNotifications);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  if (loading) {
    return (
      <Layout>
        <Shell>
          <Card>
            <CardHeader>
              <CardTitle>Chargement des notifications...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            </CardContent>
          </Card>
        </Shell>
      </Layout>
    );
  }

  return (
    <Layout>
      <Shell>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Notifications</CardTitle>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardDescription>
              Restez informé des dernières mises à jour et annonces.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-4">
                Aucune notification pour le moment.
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-300px)] w-full">
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="py-4 px-2 relative hover:bg-secondary/50 transition-colors duration-150"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.read && (
                          <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex justify-end">
                        <button
                          className="text-sm text-blue-500 hover:underline"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Marquer comme lu
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            {notifications.some((notification) => !notification.read) && (
              <div className="mt-4 flex justify-center">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={markAllAsRead}
                >
                  Tout marquer comme lu
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </Shell>
    </Layout>
  );
};

export default Notifications;
