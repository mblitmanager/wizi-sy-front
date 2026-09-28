import { cn } from "@/lib/utils";

const NS_LOGO = "/assets/ns-logo.png";
const WIZI_LOGO = "/assets/logo.png";

interface BrandLogosProps {
  /** Hauteur des logos (classe Tailwind), ex. "h-9". */
  size?: string;
  className?: string;
  /** Affiche uniquement le logo Wizi Learn (espaces très étroits). */
  compact?: boolean;
}

/** Double identité de la plateforme : NS Conseil | Wizi Learn. */
export function BrandLogos({ size = "h-9", className, compact = false }: BrandLogosProps) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      {!compact && (
        <>
          <img src={NS_LOGO} alt="NS Conseil" className={cn(size, "w-auto object-contain")} />
          <span aria-hidden className="h-7 w-px bg-border" />
        </>
      )}
      <img src={WIZI_LOGO} alt="Wizi Learn" className={cn(size, "w-auto object-contain")} />
    </span>
  );
}
