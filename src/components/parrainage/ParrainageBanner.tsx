import { Link } from "react-router-dom";
import { ArrowRight, Gift, X } from "lucide-react";
import { useParrainageEvents } from "@/hooks/useParrainageEvents";
import { useEffect, useState } from "react";
import { FORMATIONMETADATA } from "@/utils/constants";

interface ParrainageBannerProps {
  isMobile?: boolean;
}

export function ParrainageBanner({ isMobile = false }: ParrainageBannerProps) {
  const { events, loading } = useParrainageEvents();
  const [showBanner, setShowBanner] = useState(true);

  // Trouver l'événement actif - utiliser les données même pendant le loading
  const activeEvent = events.find((event) => event.status === "active");

  useEffect(() => {
    if (activeEvent) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [activeEvent]);

  const handleCloseBanner = () => {
    setShowBanner(false);
    if (activeEvent) {
      const hiddenEvents = JSON.parse(
        localStorage.getItem("hiddenParrainageEvents") || "[]"
      );
      if (!hiddenEvents.includes(activeEvent.id)) {
        hiddenEvents.push(activeEvent.id);
        localStorage.setItem(
          "hiddenParrainageEvents",
          JSON.stringify(hiddenEvents)
        );
      }
    }
  };

  if (!activeEvent || !showBanner) {
    return null;
  }

  return (
    <div className="px-3 pt-3 md:px-4 lg:px-6 min-[1441px]:px-8">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 rounded-2xl border border-border bg-card px-3 shadow-[var(--shadow-sm)] py-2.5 text-foreground sm:gap-4 sm:px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold text-navy">
          <Gift className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{activeEvent.titre}</p>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">Invitez un proche et bénéficiez d'une récompense sur votre prochaine formation.</p>
        </div>
        <strong className="shrink-0 text-base font-extrabold tabular-nums text-primary sm:text-lg">{parseFloat(activeEvent.prix).toFixed(0)}{FORMATIONMETADATA.euros}</strong>
        <Link to="/parrainage" aria-label="Découvrir le parrainage" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:px-4 sm:text-sm">
          <span className={isMobile ? "sr-only" : ""}>Découvrir</span><ArrowRight className="h-4 w-4" />
        </Link>
        <button onClick={handleCloseBanner} aria-label="Masquer la bannière de parrainage" className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
