import { clsx } from "clsx";
import { Lightbulb, BookOpen } from "lucide-react";

interface Props {
  active: "tutoriel" | "astuce";
  onChange: (category: "tutoriel" | "astuce") => void;
}

export default function MediaTabs({ active, onChange }: Props) {
  const tabs = [
    { key: "tutoriel", label: "Tutoriels", icon: BookOpen },
    { key: "astuce", label: "Astuces", icon: Lightbulb },
  ] as const;

  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-inner">
      {tabs.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium",
              isActive
                ? "bg-blue-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-200"
            )}>
            <Icon
              className={clsx(
                "w-4 h-4",
                isActive ? "text-white" : "text-blue-600"
              )}
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
