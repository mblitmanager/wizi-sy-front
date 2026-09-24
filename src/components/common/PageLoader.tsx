import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const wiziLogo = "/assets/logo.png";

/**
 * Chargement d'une page à l'intérieur du Layout (chunk de route, garde d'auth...).
 * Un squelette neutre évite le "flash" plein écran à chaque navigation.
 */
export const PageLoader = memo(function PageLoader() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300" role="status" aria-live="polite">
      <span className="sr-only">Chargement…</span>
      <div className="space-y-2">
        <Skeleton className="h-8 w-2/3 max-w-sm" />
        <Skeleton className="h-4 w-1/2 max-w-xs" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
});

/** Chargement initial de l'application ou d'une page sans Layout. */
export const FullScreenLoader = memo(function FullScreenLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-5">
        <img src={wiziLogo} alt="Wizi Learn" className="h-14 w-auto" />
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-4 border-yellow-200" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{message ?? "Chargement…"}</p>
      </div>
    </div>
  );
});

/** Squelette de liste/grille pour les sections qui chargent leurs données. */
export const SectionSkeleton = memo(function SectionSkeleton({
  count = 3,
  className = "h-28",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-live="polite">
      <span className="sr-only">Chargement…</span>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`w-full rounded-xl ${className}`} />
      ))}
    </div>
  );
});
