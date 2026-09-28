import { Megaphone, X, ArrowRight, BookOpen, Star, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WelcomeBannerProps {
  showDismissOption?: boolean;
  variant?: "default" | "minimal" | "featured";
  onHide?: () => void;
}

export const WelcomeBanner = ({
  showDismissOption = true,
  variant = "default",
  onHide,
}: WelcomeBannerProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Vérifier la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Vérifier si l'utilisateur a déjà masqué la bannière
  useEffect(() => {
    const hasDismissed = localStorage.getItem("welcomeBannerDismissed");
    if (hasDismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("welcomeBannerDismissed", "true");
    onHide?.();
  };

  const handleDiscover = () => {
    window.open("/manuel", "_blank");
  };

  const features = [
    { icon: BookOpen, text: t("welcome.features.formations") },
    { icon: Zap, text: t("welcome.features.quiz") },
    { icon: Star, text: t("welcome.features.progress") },
  ];

  if (!isVisible) return null;

  // Version compacte pour les petits écrans ou contextes spécifiques
  if (variant === "minimal" || isMobile) {
    return (
      <div className="relative mb-5 rounded-2xl border border-border bg-accent/60 p-4">
        {showDismissOption && (
          <button
            className="absolute right-2.5 top-2.5 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            onClick={handleClose}
            aria-label="Fermer le message de bienvenue">
            <X size={16} />
          </button>
        )}

        <div className="flex items-center gap-3 pr-6">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Megaphone size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-foreground">{t("welcome.title")}</h3>
            <p className="truncate text-sm text-muted-foreground">{t("welcome.subtitle")}</p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            onClick={handleDiscover}
            className="h-10 flex-1 rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            {t("welcome.discover")}
          </Button>
          {showDismissOption && (
            <Button
              variant="outline"
              onClick={handleClose}
              className="h-10 flex-1 rounded-xl border-border bg-card text-sm font-medium">
              {t("welcome.ignore")}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy to-navy-light text-white shadow-[var(--shadow-md)]">
      {/* Formes décoratives : bulle Wizi et or NS Conseil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-[45%_55%_60%_40%/55%_45%_55%_45%] bg-gold/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-[55%_45%_40%_60%/45%_55%_45%_55%] bg-white/5"
      />

      <div className="relative p-6 md:p-8">
        {showDismissOption && (
          <button
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            onClick={handleClose}
            aria-label="Fermer le message de bienvenue">
            <X size={16} />
          </button>
        )}

        <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:gap-8">
          <div className="relative flex-shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold text-navy shadow-lg shadow-black/20 md:h-16 md:w-16">
              <Megaphone size={28} />
            </div>
            {variant === "featured" && (
              <Badge className="absolute -right-2 -top-2 border-0 bg-white px-2 py-0.5 text-[10px] font-bold text-navy hover:bg-white">
                {t("welcome.new")}
              </Badge>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="mb-1.5 font-poppins text-2xl font-bold leading-tight text-white md:text-3xl">
              {t("welcome.title")}
            </h1>
            <p className="mb-2 text-base font-semibold text-gold md:text-lg">{t("welcome.subtitle")}</p>
            <p className="mb-5 max-w-3xl text-sm leading-relaxed text-white/75 md:text-base">
              {t("welcome.description")}
            </p>

            <div className="mb-6 flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-medium text-white/90">
                  <feature.icon size={15} className="text-gold" />
                  {feature.text}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <Button
                onClick={handleDiscover}
                className="group/btn h-11 rounded-xl bg-gold px-6 font-semibold text-navy shadow-sm hover:bg-gold/90">
                {t("welcome.discover_platform")}
                <ArrowRight size={16} className="transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Button>

              {showDismissOption && (
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="h-11 rounded-xl border-white/25 bg-transparent px-6 font-medium text-white hover:bg-white/10 hover:text-white">
                  {t("welcome.explore_myself")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
