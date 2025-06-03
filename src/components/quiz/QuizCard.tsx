import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award } from "lucide-react";
import type { Quiz, Category } from "@/types/quiz";
import React from "react";
import { stripHtmlTags } from "@/utils/UtilsFunction";

// Helpers pour la coloration
const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "débutant":
      return "secondary";
    case "intermédiaire":
      return "default";
    case "avancé":
    case "super quiz":
      return "destructive";
    default:
      return "outline";
  }
};

const getLevelBackgroundColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "débutant":
      return "bg-green-100 text-green-800";
    case "intermédiaire":
      return "bg-blue-100 text-blue-800";
    case "avancé":
    case "super quiz":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "";
  }
};

const getCategoryColor = (quiz: Quiz, categories: Category[] | undefined) => {
  if (!categories) return "#3B82F6";
  // Priorité au categorieId
  if (quiz.categorieId) {
    const categoryById = categories.find((c) => c.id === quiz.categorieId);
    if (categoryById?.color) return categoryById.color;
  }

  // Fallback sur la catégorie par nom
  const categoryByName = categories.find(
    (c) => c.name.toLowerCase() === quiz.categorie?.toLowerCase()
  );
  if (categoryByName?.color) return categoryByName.color;

  // Couleurs par défaut basées sur le contenu
  const searchText = (
    (quiz.titre || "") +
    " " +
    (quiz.categorie || "")
  ).toLowerCase();

  if (searchText.includes("excel") || searchText.includes("bureautique")) {
    return "#3B82F6"; // Bleu
  }
  if (searchText.includes("anglais")) {
    return "#10B981"; // Vert
  }
  if (searchText.includes("français")) {
    return "#EF4444"; // Rouge
  }
  if (searchText.includes("langues")) {
    return "#EC4899"; // Rose
  }
  if (searchText.includes("internet")) {
    return "#F59E0B"; // Orange
  }
  if (searchText.includes("création")) {
    return "#8B5CF6"; // Violet
  }

  return "#3B82F6";
};

interface QuizCardProps {
  quiz: Quiz;
  categories: Category[] | undefined;
}

export function QuizCard({ quiz, categories }: QuizCardProps) {
  // Utiliser prioritairement categorieId pour trouver la catégorie
  const category =
    categories?.find((c) => c.id === quiz.categorieId) ||
    categories?.find(
      (c) => c.name.toLowerCase() === quiz.categorie?.toLowerCase()
    );

  const categoryName = category?.name || quiz.categorie || "Non catégorisé";
  const categoryColor = getCategoryColor(quiz, categories);

  return (
    <Card className="w-full h-full hover:shadow-md transition-shadow shadow-lg relative border-1">
      {/* Ligne colorée en haut */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
        style={{ backgroundColor: categoryColor }}
      />

      <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
        <div className="flex items-center gap-1 mb-1">
          <Badge
            variant="outline"
            className="text-[0.65rem] px-1.5 py-0.5 sm:text-xs sm:px-2 flex items-center gap-1 font-medium"
            style={{
              borderColor: categoryColor,
              color: categoryColor,
              backgroundColor: `${categoryColor}10`,
            }}>
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            <span className="truncate max-w-[80px] sm:max-w-none">
              {categoryName}
            </span>
          </Badge>
        </div>
        <CardTitle className="text-sm sm:text-base font-semibold line-clamp-2 leading-tight">
          {quiz.titre}
        </CardTitle>
        <CardDescription className="text-xs sm:text-xs line-clamp-2 mt-1 leading-snug">
          {stripHtmlTags(quiz.description)}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Badge
            variant={getLevelColor(quiz.niveau)}
            className={`text-[0.65rem] px-1.5 py-0.5 sm:text-xs sm:px-2 ${getLevelBackgroundColor(
              quiz.niveau
            )}`}>
            <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
            {quiz.niveau}
          </Badge>
          <Badge
            variant="outline"
            className="text-[0.65rem] px-1.5 py-0.5 sm:text-xs sm:px-2">
            <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
            {quiz.questions?.length * 2} pts
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
