import React from "react";
import { 
  Bot, 
  Paintbrush, 
  Laptop, 
  Globe, 
  Globe2,
  LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
  description: string;
  count: number;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string) => void;
}

const CATEGORY_CONFIG: Record<string, { icon: LucideIcon; color: string; bgColor: string; activeBg: string }> = {
  "Bureautique": {
    icon: Laptop,
    color: "#3D9BE9",
    bgColor: "bg-white",
    activeBg: "bg-[#3D9BE9]",
  },
  "Langues": {
    icon: Globe2,
    color: "#A55E6E",
    bgColor: "bg-white",
    activeBg: "bg-[#A55E6E]",
  },
  "IA": {
    icon: Bot,
    color: "#ABDA96",
    bgColor: "bg-white",
    activeBg: "bg-[#ABDA96]",
  },
  "Internet": {
    icon: Globe,
    color: "#FFC533",
    bgColor: "bg-white",
    activeBg: "bg-[#FFC533]",
  },
  "Création": {
    icon: Paintbrush,
    color: "#9392BE",
    bgColor: "bg-white",
    activeBg: "bg-[#9392BE]",
  },
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto pb-4 no-scrollbar">
      <div className="flex flex-nowrap sm:flex-wrap justify-center gap-4 min-w-max sm:min-w-0 px-4">
        {categories.map((category) => {
          const config = CATEGORY_CONFIG[category.name] || {
            icon: Laptop,
            color: "#6b7280",
            bgColor: "bg-white",
            activeBg: "bg-gray-500",
          };
          
          const Icon = config.icon;
          const isActive = selectedCategory === category.name;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.name)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-[20px] border transition-all duration-300 w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] flex-shrink-0",
                isActive 
                  ? `${config.activeBg} border-transparent shadow-lg scale-105` 
                  : "bg-white border-[#E5E7EB] hover:border-gray-200 hover:shadow-sm"
              )}
            >
              <div className={cn(
                "p-2 sm:p-3 rounded-full mb-1",
                isActive ? "bg-white/20" : ""
              )}>
                <Icon 
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 transition-colors",
                    isActive ? "text-white" : ""
                  )}
                  style={!isActive ? { color: config.color } : {}}
                />
              </div>
              <span 
                className={cn(
                  "text-[12px] sm:text-sm font-semibold text-center leading-tight transition-colors",
                  isActive ? "text-white" : "text-gray-700"
                )}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
