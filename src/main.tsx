import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { NotificationProvider } from "./context/NotificationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerServiceWorker } from "./serviceWorkerRegistration";

registerServiceWorker();

// Demander la permission de notification dès l'ouverture du site ou PWA
if ("Notification" in window && navigator.serviceWorker) {
  window.addEventListener("load", () => {
    Notification.requestPermission();
  });
}

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </NotificationProvider>
  </React.StrictMode>
);
