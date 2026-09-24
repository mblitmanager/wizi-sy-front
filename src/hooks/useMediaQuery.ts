import { useCallback, useSyncExternalStore } from "react";

/**
 * Suit une media query CSS. La valeur est correcte dès le premier rendu
 * (pas de saut de mise en page), contrairement à un état initialisé à `false`.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
