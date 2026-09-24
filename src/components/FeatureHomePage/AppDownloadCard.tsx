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
      className="group relative my-8 rounded-xl border border-orange-500/30 p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
      aria-label={platform.title}
    >
      <button
        className="absolute right-3 top-3 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        onClick={dismiss}
        aria-label="Fermer"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="mb-2 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-400 transition-colors group-hover:bg-orange-500/20">
          <platform.Icon className="h-6 w-6" />
        </span>
        <h2 className="text-lg font-bold text-orange-400 md:text-2xl">{platform.title}</h2>
      </div>
      <p className="mb-3 text-sm text-gray-500">{platform.description}</p>
      <div className="mt-4 flex justify-end">
        <button
          className="w-full rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-white shadow transition-colors hover:bg-orange-600 sm:w-auto"
          onClick={open}
        >
          {platform.cta}
        </button>
      </div>
    </section>
  );
}
