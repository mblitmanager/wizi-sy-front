import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useAuth";

const THEME_CLASS = "theme-app";

/** Écrans d'authentification : ils gardent leur apparence propre. */
const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

function isAuthPath(pathname: string) {
  return AUTH_PATHS.includes(pathname) || /^\/parrainage\/[^/]+$/.test(pathname);
}

/**
 * Active le thème de l'espace connecté (classe `theme-app` sur <html>, voir app-theme.css).
 * Posée sur <html> et non sur un conteneur pour que les éléments rendus en portail
 * (menus, dialogues, popovers, toasts) en profitent aussi.
 * La landing page (`/` sans session) et l'authentification ne sont pas concernées.
 */
export function ThemeScope() {
  const { token } = useUser();
  const { pathname } = useLocation();
  const enabled = !!token && !isAuthPath(pathname);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle(THEME_CLASS, enabled);
  }, [enabled]);

  return <Outlet />;
}
