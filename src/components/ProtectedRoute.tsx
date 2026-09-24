import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";
import { PageLoader } from "@/components/common/PageLoader";
import { Button } from "@/components/ui/button";
import { AppRole, ROLE_HOME } from "@/utils/roles";

interface ProtectedRouteProps {
  children: ReactNode;
  /** Rôles autorisés. Sans cette prop, tout utilisateur connecté a accès. */
  roles?: AppRole[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { token, user, role, isLoading, refetchUser } = useUser();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Session en cours de vérification (premier chargement sans profil en cache)
  if (isLoading) {
    return <PageLoader />;
  }

  // Token présent mais profil injoignable (réseau coupé, serveur indisponible)
  if (!user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-muted-foreground">Impossible de charger votre profil pour le moment.</p>
        <Button variant="outline" onClick={() => refetchUser()}>
          Réessayer
        </Button>
      </div>
    );
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to={ROLE_HOME[role]} replace />;
  }

  return <>{children}</>;
}
