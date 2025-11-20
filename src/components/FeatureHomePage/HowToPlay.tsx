import { Gamepad2, HelpCircle, Trophy, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

// Nouvelle palette de couleurs harmonieuse inspirée de Flutter
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

const steps = [
  {
    number: "1",
    icon: Gamepad2,
    color: colors.primaryBlue,
    lightColor: colors.primaryBlueLight,
    title: "Sélectionnez un quiz",
    description:
      "Choisissez un quiz adapté à votre niveau et à votre domaine de formation.",
  },
  {
    number: "2",
    icon: HelpCircle,
    color: colors.successGreen,
    lightColor: colors.successGreenLight,
    title: "Répondez aux questions",
    description:
      "Évaluez vos compétences en répondant à une série de questions interactives et chronométrées.",
  },
  {
    number: "3",
    icon: Trophy,
    color: colors.warningOrange,
    lightColor: colors.warningOrangeLight,
    title: "Progressez dans le classement",
    description:
      "Accumulez des points à chaque réponse correcte et améliorez votre position dans le classement.",
  },
];

export const HowToPlay = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Détection de la taille d'écran
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

  // Auto-scroll pour la version mobile
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [isMobile]);

  return (
    <div className="my-8 sm:my-12 lg:my-16 px-4 sm:px-6 lg:px-8">
      {/* En-tête */}
      <div className="mb-6 sm:mb-8 lg:mb-12 text-center">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">
          Comment participer ?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
          Découvrez en 3 étapes simples comment débuter votre parcours
          d'évaluation
        </p>
      </div>

      {/* Version desktop - grille classique */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <HowToPlayStep
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
              showProgress={true}
              isActive={true}
              variant="desktop"
            />
          ))}
        </div>
      </div>

      {/* Version tablette - grille compacte */}
      <div className="hidden md:block lg:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <HowToPlayStep
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
              showProgress={false}
              isActive={true}
              variant="tablet"
            />
          ))}
        </div>
        {/* Barre de progression globale pour tablette */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: "100%",
                background: `linear-gradient(90deg, ${colors.primaryBlue}, ${colors.successGreen}, ${colors.warningOrange})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Version mobile - carousel interactif */}
      <div className="md:hidden">
        <div className="relative">
          {/* Conteneur du carousel */}
          <div className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentStep * 100}%)` }}>
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="w-full flex-shrink-0 snap-center px-2">
                  <HowToPlayStep
                    step={step}
                    index={index}
                    isLast={index === steps.length - 1}
                    showProgress={false}
                    isActive={index === currentStep}
                    variant="mobile"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Contrôles de navigation mobile */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <button
              onClick={() =>
                setCurrentStep(
                  (prev) => (prev - 1 + steps.length) % steps.length
                )
              }
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Étape précédente">
              <ArrowRight className="w-4 h-4 rotate-180 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Indicateurs de progression */}
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "bg-blue-500 scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                  }`}
                  aria-label={`Aller à l'étape ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCurrentStep((prev) => (prev + 1) % steps.length)
              }
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Étape suivante">
              <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Indicateur de progression textuel */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Étape {currentStep + 1} sur {steps.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface HowToPlayStepProps {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
  showProgress: boolean;
  isActive: boolean;
  variant: "mobile" | "tablet" | "desktop";
}

const HowToPlayStep = ({
  step,
  index,
  isLast,
  showProgress,
  isActive,
  variant,
}: HowToPlayStepProps) => {
  const IconComponent = step.icon;

  const getProgressWidth = (stepNumber: string) => {
    switch (stepNumber) {
      case "1":
        return "33%";
      case "2":
        return "66%";
      case "3":
        return "100%";
      default:
        return "33%";
    }
  };

  // Tailles et espacements adaptatifs
  const sizes = {
    mobile: {
      padding: "p-4",
      iconSize: "w-8 h-8",
      badgeSize: "w-7 h-7 text-xs",
      titleSize: "text-base",
      textSize: "text-sm",
      gap: "space-y-2",
    },
    tablet: {
      padding: "p-5",
      iconSize: "w-9 h-9",
      badgeSize: "w-8 h-8 text-sm",
      titleSize: "text-lg",
      textSize: "text-sm",
      gap: "space-y-3",
    },
    desktop: {
      padding: "p-6",
      iconSize: "w-10 h-10",
      badgeSize: "w-8 h-8 text-sm",
      titleSize: "text-lg",
      textSize: "text-base",
      gap: "space-y-3",
    },
  };

  const currentSizes = sizes[variant];

  return (
    <div
      className={`
        relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl 
        shadow-sm hover:shadow-md transition-all duration-300 
        border border-gray-100 dark:border-gray-700
        ${currentSizes.padding}
        ${isActive ? "scale-100 opacity-100" : "scale-95 opacity-80"}
        ${variant === "mobile" ? "mx-2" : ""}
      `}>
      {/* En-tête avec numéro et icône */}
      <div
        className={`flex items-center ${
          variant === "desktop" ? "justify-between" : "justify-start gap-4"
        } mb-4 sm:mb-6`}>
        <div className="flex items-center gap-3">
          {/* Badge numéroté */}
          <div
            className={`${currentSizes.badgeSize} rounded-full flex items-center justify-center text-white font-bold shadow-sm`}
            style={{ backgroundColor: step.color }}>
            {step.number}
          </div>

          {/* Icône avec fond coloré */}
          <div
            className={`${currentSizes.iconSize} rounded-full flex items-center justify-center`}
            style={{ backgroundColor: step.lightColor }}>
            <IconComponent
              className={variant === "mobile" ? "w-4 h-4" : "w-5 h-5"}
              style={{ color: step.color }}
            />
          </div>
        </div>

        {/* Flèche de progression (desktop uniquement) */}
        {!isLast && showProgress && variant === "desktop" && (
          <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </div>

      {/* Contenu texte */}
      <div className={currentSizes.gap}>
        <h3
          className={`${currentSizes.titleSize} font-semibold`}
          style={{ color: step.color }}>
          {step.title}
        </h3>

        <p
          className={`${currentSizes.textSize} text-gray-600 dark:text-gray-300 leading-relaxed`}>
          {step.description}
        </p>
      </div>

      {/* Barre de progression individuelle */}
      {showProgress && variant === "desktop" && (
        <div className="mt-4 sm:mt-6">
          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: getProgressWidth(step.number),
                background: `linear-gradient(90deg, ${step.color}, ${step.color}DD)`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Fonction utilitaire pour assombrir une couleur
const getDarkerColor = (color: string): string => {
  return color;
};
