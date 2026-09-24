import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

/** Page d'erreur des routes : exception de rendu ou chunk introuvable après un déploiement. */
export function RouteError() {
  const error = useRouteError();
  const isChunkError =
    error instanceof Error && /dynamically imported module|Loading chunk|Importing a module script failed/i.test(error.message);

  const title = isRouteErrorResponse(error) && error.status === 404 ? "Page introuvable" : "Une erreur est survenue";
  const message = isChunkError
    ? "Une nouvelle version de l'application est disponible. Rechargez la page pour continuer."
    : "Désolé, une erreur inattendue s'est produite. Rechargez la page ou revenez à l'accueil.";

  if (import.meta.env.DEV) console.error(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md rounded-xl bg-card p-6 text-center shadow-md">
        <h1 className="mb-3 text-2xl font-bold text-foreground">{title}</h1>
        <p className="mb-6 text-muted-foreground">{message}</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Recharger</Button>
          <Button variant="outline" asChild>
            <Link to="/">Accueil</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
