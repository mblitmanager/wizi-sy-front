import { Megaphone, X, ArrowRight, BookOpen, Star, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Palette de couleurs Flutter harmonieuse
const colors = {
  primaryBlue: "#3D9BE9",
  primaryBlueLight: "#E8F4FE",
  primaryBlueDark: "#2A7BC8",

  successGreen: "#ABDA96",
  successGreenLight: "#F0F9ED",
  successGreenDark: "#7BBF5E",

  accentPurple: "#9392BE",
  accentPurpleLight: "#F5F4FF",
  accentPurpleDark: "#6A6896",

  warningOrange: "#FFC533",
  warningOrangeLight: "#FFF8E8",
  warningOrangeDark: "#E6A400",

  neutralWhite: "#FFFFFF",
  neutralGrey: "#F8F9FA",
  neutralGreyDark: "#6C757D",
  neutralBlack: "#212529",
};

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
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Vérifier la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

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
    console.log("User clicked discover platform");
  };

  const features = [
    {
      icon: BookOpen,
      text: t("welcome.features.formations"),
      color: colors.primaryBlue,
    },
    { icon: Zap, text: t("welcome.features.quiz"), color: colors.successGreen },
    { icon: Star, text: t("welcome.features.progress"), color: colors.warningOrange },
  ];

  if (!isVisible) return null;

  // Version minimaliste pour les petits écrans ou contextes spécifiques
  if (variant === "minimal" || isMobile) {
    return (
      <div
        className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 transition-all duration-300 hover:shadow-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {showDismissOption && (
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
            onClick={handleClose}
            aria-label="Fermer le message de bienvenue">
            <X size={16} />
          </button>
        )}

        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0"
            style={{
              backgroundColor: colors.primaryBlueLight,
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}>
            <Megaphone size={18} style={{ color: colors.primaryBlue }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {t("welcome.title")}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {t("welcome.subtitle")}
            </p>
          </div>
        </div>

        {/* Bouton d'action pour mobile */}
        <div className="mt-3 flex gap-2">
          <Button
            onClick={handleDiscover}
            className="flex-1 text-sm font-medium py-2 rounded-lg transition-all duration-300"
            style={{
              background: colors.primaryBlue,
              color: colors.neutralWhite,
            }}>
            {t("welcome.discover")}
          </Button>
          {showDismissOption && (
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 text-sm font-medium py-2 rounded-lg border-2"
              style={{
                borderColor: colors.primaryBlue,
                color: colors.primaryBlue,
              }}>
              {t("welcome.ignore")}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl mb-6 mx-4 lg:mx-0"
      style={{
        background: `linear-gradient(135deg, ${colors.primaryBlueLight} 0%, ${colors.neutralWhite} 50%, ${colors.successGreenLight} 100%)`,
        border: `1px solid ${colors.primaryBlue}20`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Fond décoratif animé */}
      <div
        className="absolute inset-0 opacity-50 transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${colors.primaryBlue}15 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, ${colors.successGreen}15 0%, transparent 50%)`,
          opacity: isHovered ? 0.7 : 0.5,
        }}
      />

      {/* Points décoratifs - Responsive */}
      <div className="absolute top-4 right-4 md:top-6 md:right-20 w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-400/30 animate-pulse" />
      <div
        className="absolute bottom-6 left-4 md:bottom-8 md:left-16 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-400/40 animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-12 right-8 md:top-12 md:right-32 w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-purple-400/20 animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative p-4 sm:p-6 md:p-8">
        {/* Bouton de fermeture */}
        {showDismissOption && (
          <button
            className="absolute top-3 right-3 md:top-4 md:right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 hover:bg-white/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-label="Fermer le message de bienvenue"
            style={{ color: colors.neutralGreyDark }}>
            <X size={16} />
          </button>
        )}

        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 md:gap-6">
          {/* Section icône et titre */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <div
              className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl transition-all duration-500 group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryBlue}, ${colors.primaryBlueDark})`,
                boxShadow: `0 8px 32px ${colors.primaryBlue}40, 
                           inset 0 1px 0 ${colors.primaryBlue}30`,
              }}>
              <Megaphone size={isTablet ? 24 : 28} className="text-white" />

              {/* Effet de brillance */}
              <div
                className="absolute inset-0 rounded-xl md:rounded-2xl opacity-30 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, transparent 30%, white 70%)`,
                  opacity: isHovered ? 0.4 : 0.2,
                }}
              />
            </div>

            {/* Badge "Nouveau" pour la version featured */}
            {variant === "featured" && (
                <Badge
                className="absolute -top-1 -right-1 md:-top-2 md:-right-2 px-2 py-0.5 md:px-2 md:py-1 text-xs font-bold border-0 animate-bounce"
                style={{
                  backgroundColor: colors.warningOrange,
                  color: colors.neutralWhite,
                }}>
                {t("welcome.new")}
              </Badge>
            )}
          </div>

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 md:mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight">
                {t("welcome.title")}
              </h1>

              <p
                className="text-base md:text-lg font-medium mb-2 md:mb-3 transition-colors duration-300"
                style={{ color: colors.primaryBlueDark }}>
                {t("welcome.subtitle")}
              </p>

              <p
                className="text-sm md:text-base leading-relaxed max-w-3xl transition-colors duration-300"
                style={{ color: colors.neutralGreyDark }}>
                {t("welcome.description")}
              </p>
            </div>

            {/* Fonctionnalités principales - Responsive */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-4 mb-4 md:mb-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex-1 min-w-[140px] sm:flex-initial"
                  style={{
                    backgroundColor: `${feature.color}15`,
                    border: `1px solid ${feature.color}20`,
                  }}>
                  <feature.icon
                    size={isMobile ? 14 : 16}
                    style={{ color: feature.color }}
                  />
                  <span
                    className="text-xs md:text-sm font-medium whitespace-nowrap"
                    style={{ color: feature.color }}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <Button
                onClick={handleDiscover}
                className="group/btn font-semibold px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0 flex-1 sm:flex-initial"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryBlue}, ${colors.primaryBlueDark})`,
                  color: colors.neutralWhite,
                }}>
                <span className="flex items-center gap-1 md:gap-2 justify-center">
                  <span className="text-sm md:text-base">
                    {isMobile ? t("welcome.discover") : t("welcome.discover_platform")}
                  </span>
                  <ArrowRight
                    size={isMobile ? 14 : 16}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </span>
              </Button>

              {showDismissOption && (
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="font-medium px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-300 border-2 hover:scale-105 flex-1 sm:flex-initial"
                  style={{
                    borderColor: colors.primaryBlue,
                    color: colors.primaryBlue,
                    backgroundColor: "transparent",
                  }}>
                  <span className="text-sm md:text-base">
                    {isMobile ? t("welcome.explore") : t("welcome.explore_myself")}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de progression (optionnel) */}
      {variant === "featured" && (
        <div
          className="h-1 bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 opacity-50 transition-all duration-1000"
          style={{
            transform: isHovered ? "scaleX(1)" : "scaleX(0.8)",
            transformOrigin: "left center",
          }}
        />
      )}
    </div>
  );
};
