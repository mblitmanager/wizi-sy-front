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
    <div className="sticky top-0 z-20 px-3 pt-2 md:px-4 lg:px-6">
      <div className="mx-auto flex min-h-[64px] max-w-[1600px] items-center gap-3 rounded-2xl border border-[#e9c66c] bg-[#fff4d8] px-4 py-3 text-[#173f46] shadow-lg shadow-[#173f46]/10 sm:gap-4 sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6c454] text-[#173f46]">
          <Gift className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold sm:text-base">{activeEvent.titre}</p>
          <p className="hidden text-xs text-[#6b7773] sm:block">Invitez un proche et bénéficiez d'une récompense sur votre prochaine formation.</p>
        </div>
        <strong className="shrink-0 text-lg font-extrabold text-[#b47700] sm:text-xl">{parseFloat(activeEvent.prix).toFixed(0)}{FORMATIONMETADATA.euros}</strong>
        <Link to="/parrainage" aria-label="Découvrir le parrainage" className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg bg-[#173f46] px-3 text-xs font-bold text-white transition hover:bg-[#245963] sm:px-4 sm:text-sm">
          <span className={isMobile ? "sr-only" : ""}>Découvrir</span><ArrowRight className="h-4 w-4" />
        </Link>
        <button onClick={handleCloseBanner} aria-label="Masquer la bannière de parrainage" className="shrink-0 rounded-lg p-2 text-[#6b7773] transition hover:bg-[#f4dfaa] hover:text-[#173f46]"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
