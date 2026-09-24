import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
// Brand variables (shared with Flutter AppColors)
import "./styles/brand.css";
import "./styles/brand-yellow.css";
import { registerServiceWorker } from "./serviceWorkerRegistration";

registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
