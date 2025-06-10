import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isLoading } = useUser();

  // Si l'authentification est en cours de chargement, afficher un écran de chargement
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est authentifié, afficher le contenu protégé
  return <>{children}</>;
}
