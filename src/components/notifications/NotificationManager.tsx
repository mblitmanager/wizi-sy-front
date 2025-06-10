import { useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { useUser } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/useLocalStorage";

export function NotificationManager() {
  const { isSupported, permission, requestPermission } = useNotifications();
  const { user } = useUser();
  const { toast } = useToast();
  const [askedForPermission, setAskedForPermission] = useLocalStorage(
    "notification-permission-asked",
    false
  );
  const [lastPrompt, setLastPrompt] = useLocalStorage(
    "last-notification-prompt",
    0
  );

  // Fonction pour afficher une demande d'autorisation après un délai
  const promptForPermissions = () => {
    if (!isSupported || permission !== "default" || askedForPermission) return;

    const now = Date.now();
    // N'afficher qu'une fois par jour au maximum
    if (now - lastPrompt < 24 * 60 * 60 * 1000) return;

    toast({
      title: "Activer les notifications",
      description: "Recevez des alertes pour les nouveaux quiz et formations",
      action: (
        <button
          className="rounded bg-primary text-white px-3 py-1"
          onClick={() => {
            requestPermission();
            setAskedForPermission(true);
            setLastPrompt(now);
          }}>
          Activer
        </button>
      ),
      duration: 10000,
    });
  };

  // Demander l'autorisation de notification à l'utilisateur connecté
  useEffect(() => {
    if (user && isSupported) {
      // Attendre un peu avant d'afficher la demande
      const timer = setTimeout(promptForPermissions, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, isSupported, permission]);

  return null; // Ce composant ne rend rien
}

export default NotificationManager;
