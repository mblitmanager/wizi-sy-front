import { clsx } from "clsx";
import { Lightbulb, BookOpen } from "lucide-react";

interface Props {
  active: "tutoriel" | "astuce";
  onChange: (category: "tutoriel" | "astuce") => void;
  className?: string;
  compact?: boolean;
}

export default function MediaTabs({ active, onChange, className, compact = false }: Props) {
  const tabs = [
    { key: "tutoriel", label: "Tutoriels", icon: BookOpen },
    { key: "astuce", label: "Astuces", icon: Lightbulb },
  ] as const;

  return (
    <div className={clsx("w-full overflow-x-auto", className)}>
      <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1 shadow-inner mx-auto min-w-max sm:min-w-0">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              aria-label={label}
              aria-pressed={isActive ? "true" : "false"}
              title={label}
              className={clsx(
                "flex items-center gap-1.5 rounded-full font-medium transition-all whitespace-nowrap",
                // Ensure minimum 44px touch target
                compact
                  ? "min-w-[44px] min-h-[44px] px-2 py-2 justify-center"
                  : "px-4 py-2.5 min-h-[44px]",
                "text-xs sm:text-sm",
                isActive
                  ? "bg-wizi text-white shadow"
                  : "text-gray-700 hover:bg-gray-200 active:bg-gray-300"
              )}>
              <Icon
                className={clsx(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-white" : "text-wizi-muted"
                )}
              />
              <span className={compact ? "sr-only" : "hidden sm:inline"}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
