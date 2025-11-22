import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Brand variables (shared with Flutter AppColors)
import "./styles/brand.css";
import "./styles/brand-yellow.css";
import { NotificationProvider } from "./context/NotificationProvider";
import DisplaySettingsProvider from "@/contexts/DisplaySettingsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerServiceWorker } from "./serviceWorkerRegistration";
import { UserProvider } from "@/context/UserContext";

registerServiceWorker();

// Demander la permission de notification dès l'ouverture du site ou PWA
if ("Notification" in window && navigator.serviceWorker) {
  window.addEventListener("load", () => {
    Notification.requestPermission();
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Garder les données fraîches pendant 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Garder les données en cache pendant 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
      // Ne pas refetch automatiquement au focus de la fenêtre
      refetchOnWindowFocus: false,
      // Retry une seule fois en cas d'erreur
      retry: 1,
      // Refetch en arrière-plan pour les données stale
      refetchOnMount: true,
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NotificationProvider>
      <DisplaySettingsProvider>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <App />
          </UserProvider>
        </QueryClientProvider>
      </DisplaySettingsProvider>
    </NotificationProvider>
  </React.StrictMode>
);
