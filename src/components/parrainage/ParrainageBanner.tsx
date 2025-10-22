import { Link } from "react-router-dom";
import { X } from "lucide-react";
import gift from "../../assets/giftbox.png";
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
    <div
      className={`${
        isMobile
          ? "fixed top-[54px] left-0 right-0 z-40 w-full"
          : "bg-slate-100 text-white relative z-30"
      }`}>
      <div
        className={`${
          isMobile ? "px-4 py-2" : "container mx-auto px-4 py-3"
        } h-[60px] flex items-center justify-between rounded-md shadow-md bg-gradient-to-r from-orange-500 to-red-600 relative`}>
        <div className="flex items-center gap-2">
          <img
            src={gift}
            className={`${
              isMobile ? "h-6 w-6" : "h-7 w-7"
            } text-white drop-shadow-md`}
          />
          <span
            className={`font-extrabold ${
              isMobile ? "text-sm sm:text-lg" : "text-xl sm:text-2xl"
            } text-white drop-shadow-md`}>
            {activeEvent.titre}
            <span
              className={`${
                isMobile ? "ml-1 text-xl" : "ml-2 text-2xl"
              } text-yellow-300 drop-shadow-lg`}>
              {parseFloat(activeEvent.prix).toFixed(0)} $
              {FORMATIONMETADATA.euros}
            </span>
          </span>
          <Link to="/parrainage" className="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`${
                isMobile ? "h-6 w-6" : "h-8 w-8"
              } text-white hover:text-yellow-300 transition-transform transform hover:translate-x-1 drop-shadow-md`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
        <button
          onClick={handleCloseBanner}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-yellow-300 transition">
          <X className={isMobile ? "h-5 w-5" : "h-6 w-6"} />
        </button>
      </div>
    </div>
  );
}
