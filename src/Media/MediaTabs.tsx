import { clsx } from "clsx";
import { Lightbulb, BookOpen } from "lucide-react";

interface Props {
  active: "tutoriel" | "astuce";
  onChange: (category: "tutoriel" | "astuce") => void;
  className?: string;
}

export default function MediaTabs({ active, onChange, className }: Props) {
  const tabs = [
    { key: "tutoriel", label: "Tutoriels", icon: BookOpen },
    { key: "astuce", label: "Astuces", icon: Lightbulb },
  ] as const;

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 p-1 shadow-inner mx-auto min-w-max sm:min-w-0 ">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={clsx(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                isActive
                  ? "bg-wizi text-white shadow"
                  : "text-gray-700 hover:bg-gray-200"
              )}>
              <Icon
                className={clsx(
                  "w-4 h-4",
                  isActive ? "text-white" : "text-yellow-600"
                )}
              />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
