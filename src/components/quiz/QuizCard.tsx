import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Clock } from "lucide-react";
import type { Quiz, Category } from "@/types/quiz";
import React from "react";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import bureatique from "../../assets/icons/bureautique.png";
import internet from "../../assets/icons/internet.png";
import creation from "../../assets/icons/creation.png";
import langues from "../../assets/icons/langues.png";

// Configuration complète des catégories
const CATEGORY_CONFIG = {
  bureautique: {
    icon: bureatique,
    color: "#3B82F6", // Bleu vif
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-800",
    badgeColor: "bg-blue-100",
  },
  internet: {
    icon: internet,
    color: "#F59E0B", // Orange vif
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-800",
    badgeColor: "bg-orange-100",
  },
  création: {
    icon: creation,
    color: "#8B5CF6", // Violet
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-800",
    badgeColor: "bg-purple-100",
  },
  langues: {
    icon: langues,
    color: "#EC4899", // Rose
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-800",
    badgeColor: "bg-pink-100",
  },
  anglais: {
    icon: null,
    color: "#10B981", // Vert émeraude
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-800",
    badgeColor: "bg-emerald-100",
  },
  français: {
    icon: null,
    color: "#EF4444", // Rouge
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-800",
    badgeColor: "bg-red-100",
  },
  default: {
    icon: null,
    color: "#64748B", // Gris bleuté
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-800",
    badgeColor: "bg-slate-100",
  },
};

const getCategoryConfig = (categoryName: string) => {
  const lowerName = categoryName.toLowerCase();

  // Trouver la configuration correspondante
  for (const [key, config] of Object.entries(CATEGORY_CONFIG)) {
    if (lowerName.includes(key)) {
      return {
        ...config,
        name: categoryName,
      };
    }
  }

  return {
    ...CATEGORY_CONFIG.default,
    name: categoryName,
  };
};

// Helpers pour la coloration des niveaux
const getLevelConfig = (level: string) => {
  switch (level?.toLowerCase()) {
    case "débutant":
      return {
        color: "#10B981",
        bgClass: "bg-green-100",
        textClass: "text-green-800",
      };
    case "intermédiaire":
      return {
        color: "#3B82F6",
        bgClass: "bg-blue-100",
        textClass: "text-blue-800",
      };
    case "avancé":
    case "super quiz":
      return {
        color: "#F59E0B",
        bgClass: "bg-yellow-100",
        textClass: "text-yellow-800",
      };
    default:
      return {
        color: "#64748B",
        bgClass: "bg-gray-100",
        textClass: "text-gray-800",
      };
  }
};

interface QuizCardProps {
  quiz: Quiz;
  categories: Category[] | undefined;
}

export function QuizCard({ quiz, categories }: QuizCardProps) {
  const categoryName =
    quiz.formation?.categorie || quiz.categorie || "Non catégorisé";
  const categoryConfig = getCategoryConfig(categoryName);
  const levelConfig = getLevelConfig(quiz.niveau);
  const estimatedTime = quiz.questions?.length
    ? Math.ceil(quiz.questions.length * 0.5)
    : 5;

  return (
    <Card
      className={`w-full h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${categoryConfig.borderColor} ${categoryConfig.bgColor}`}
    >
      {/* Bande de couleur de catégorie en haut */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: categoryConfig.color }}
      />

      <div className="p-4">
        {/* Header avec icône et titre */}
        <CardHeader className="p-0 mb-3 flex flex-row items-start gap-3">
          {categoryConfig.icon && (
            <div
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: `${categoryConfig.color}20` }}
            >
              <img
                src={categoryConfig.icon}
                alt={categoryName}
                className="w-6 h-6 object-contain"
              />
            </div>
          )}

          <div className="flex-1">
            <CardTitle
              className={`text-lg font-bold line-clamp-2 ${categoryConfig.textColor}`}
            >
              {quiz.titre}
            </CardTitle>
            <Badge
              className={`mt-2 text-xs font-medium ${categoryConfig.badgeColor} ${categoryConfig.textColor}`}
            >
              {categoryName}
            </Badge>
          </div>
        </CardHeader>

        {/* Description */}
        <CardDescription className="text-sm text-gray-600 line-clamp-2 mb-4">
          {stripHtmlTags(quiz.description) ||
            "Testez vos connaissances avec ce quiz interactif."}
        </CardDescription>

        {/* Footer avec métadonnées */}
        <CardContent className="p-0">
          <div className="flex flex-wrap gap-2">
            {/* Niveau */}
            <Badge
              className={`text-xs ${levelConfig.bgClass} ${levelConfig.textClass} flex items-center gap-1`}
            >
              <BookOpen className="w-3 h-3" />
              {quiz.niveau || "Niveau"}
            </Badge>

            {/* Points */}
            <Badge
              variant="outline"
              className="text-xs flex items-center gap-1"
            >
              <Award className="w-3 h-3" />
              {quiz.questions?.length
                ? `${quiz.questions.length * 2} pts`
                : "0 pt"}
            </Badge>

            {/* Temps estimé */}
            <Badge
              variant="outline"
              className="text-xs flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              {estimatedTime} min
            </Badge>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
