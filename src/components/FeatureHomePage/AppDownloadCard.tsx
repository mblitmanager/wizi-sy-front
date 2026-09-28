import { useState } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { checkAndAnnounceAchievements } from "@/services/achievementsApi";

const DISMISS_KEY = "hideAppDownloadCard";

const PLATFORMS = {
  ios: {
    title: "Disponible sur l'App Store",
    description: "Retrouvez Wizi Learn sur l'App Store via le lien ci-dessous.",
    cta: "Ouvrir l'App Store",
    url: "https://apps.apple.com/mg/app/wizi-learn/id6752468866",
    achievementCode: "ios_download",
    Icon: Smartphone,
  },
  android: {
    title: "Télécharger l'application Android",
    description:
      "Accédez à Wizi Learn partout grâce à notre application Android. Cliquez sur le bouton ci-dessous pour télécharger le fichier et suivez les instructions d'installation.",
    cta: "Télécharger",
    url: "https://www.wizi-learn.com/application/wizi-learn.apk",
    achievementCode: "android_download",
    Icon: Download,
  },
} as const;

const isIOS = () => typeof window !== "undefined" && /iPad|iPhone|iPod/.test(window.navigator.userAgent);

/** Encart de téléchargement de l'application mobile, adapté à la plateforme du visiteur. */
export function AppDownloadCard() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === "true");
  if (dismissed) return null;

  const platform = PLATFORMS[isIOS() ? "ios" : "android"];

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  const open = () => {
    window.open(platform.url, "_blank", "noopener");
    checkAndAnnounceAchievements(platform.achievementCode);
  };

  return (
    <section
      className="relative my-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center sm:gap-5 md:p-6"
      aria-label={platform.title}
    >
      <button
        className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        onClick={dismiss}
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
      <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
        <platform.Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1 pr-6">
        <h2 className="text-base font-semibold text-foreground md:text-lg">{platform.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{platform.description}</p>
      </div>
      <button
        className="inline-flex h-11 w-full flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
        onClick={open}
      >
        <platform.Icon className="h-4 w-4" />
        {platform.cta}
      </button>
    </section>
  );
}
