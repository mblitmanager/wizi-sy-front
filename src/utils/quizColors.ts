import bureatique from "../assets/icons/bureautique.png";
import internet from "../assets/icons/internet.png";
import creation from "../assets/icons/creation.png";
import langues from "../assets/icons/langues.png";

export const CATEGORY_CONFIG = {
  bureautique: {
    icon: bureatique,
    color: "#3B82F6",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    badgeColor: "bg-blue-100",
    buttonColor: "bg-blue-600 hover:bg-blue-700",
  },
  internet: {
    icon: internet,
    color: "#F59E0B",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-800",
    badgeColor: "bg-orange-100",
    buttonColor: "bg-orange-600 hover:bg-orange-700",
  },
  création: {
    icon: creation,
    color: "#8B5CF6",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
    badgeColor: "bg-purple-100",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
  },
  IA: {
    icon: creation, // Fallback since IA.png is missing
    color: "#ABDA96",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-800",
    badgeColor: "bg-green-100",
    buttonColor: "bg-green-600 hover:bg-green-700",
  },
  langues: {
    icon: langues,
    color: "#EC4899",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-800",
    badgeColor: "bg-pink-100",
    buttonColor: "bg-pink-600 hover:bg-pink-700",
  },
  anglais: {
    icon: null,
    color: "#10B981",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
    badgeColor: "bg-emerald-100",
    buttonColor: "bg-emerald-600 hover:bg-emerald-700",
  },
  français: {
    icon: null,
    color: "#EF4444",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    badgeColor: "bg-red-100",
    buttonColor: "bg-red-600 hover:bg-red-700",
  },
  default: {
    icon: null,
    color: "#64748B",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-800",
    badgeColor: "bg-slate-100",
    buttonColor: "bg-slate-600 hover:bg-slate-700",
  },
};

export const getCategoryConfig = (categoryName: string) => {
  if (!categoryName) return CATEGORY_CONFIG.default;
  const lowerName = categoryName.toLowerCase();
  for (const [key, config] of Object.entries(CATEGORY_CONFIG)) {
    if (lowerName.includes(key)) {
      return config;
    }
  }
  return CATEGORY_CONFIG.default;
};
