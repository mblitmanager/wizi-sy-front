import { useUser } from "@/hooks/useAuth";
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

// Type pour les données de notification
interface NotificationData {
  message: string;
  data?: {
    media_id?: number;
    media_title?: string;
  };
}

const NotificationListener = () => {
  const { user } = useUser();

  useEffect(() => {
    // Créez une instance Socket.IO à l'intérieur du useEffect
    const socket: Socket = io("http://localhost:3001", {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    // Gestionnaires d'événements de base
    socket.on("connect", () => {
      console.log("Connected to socket server", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      toast.error(`Erreur de connexion: ${err.message}`);
    });

    // Enregistrement de l'utilisateur
    if (user?.user?.id) {
      console.log("Enregistrement de l'utilisateur:", user.user.id);
      socket.emit("register", String(user.user.id));
    }

    // Gestionnaire de notification
    const handleNotification = (data: NotificationData) => {
      console.log("Notification reçue:", data);
      toast.success(
        `Nouveau média: ${data.data?.media_title || "Sans titre"}\n${
          data.message
        }`,
        {
          position: "bottom-right",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
            fontSize: "12px",
          },
          icon: "📢",
        }
      );
    };

    socket.on("notification", handleNotification);

    // Nettoyage
    return () => {
      socket.off("notification", handleNotification);
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [user?.user?.id]); // Dépendance plus spécifique

  return null;
};

export default NotificationListener;
