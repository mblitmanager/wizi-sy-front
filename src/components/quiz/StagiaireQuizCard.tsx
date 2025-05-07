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
  if (!categories) return "#3B82F6"; // Couleur par défaut bleu

  // Priorité au categoryId
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

interface StagiaireQuizCardProps {
  quiz: Quiz;
  categories: Category[] | undefined;
}

export function StagiaireQuizCard({
  quiz,
  categories,
}: StagiaireQuizCardProps) {
  // Récupérer la catégorie prioritairement depuis la formation
  const formationCategorie = (
    quiz as Quiz & { formation?: { categorie?: string } }
  ).formation?.categorie;
  const categorieNom = formationCategorie || quiz.categorie;

  // Chercher la catégorie dans la liste à partir du nom trouvé
  const category =
    categories?.find(
      (c) => c.name.toLowerCase() === (categorieNom || "").toLowerCase()
    ) || categories?.find((c) => c.id === quiz.categorieId);

  const categoryName = category?.name || categorieNom || "Non catégorisé";
  const categoryColor = category?.color || "#3B82F6";

  return (
    <Card className="h-full hover:shadow-lg transition-shadow relative">
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
        style={{
          backgroundColor: categoryColor,
        }}
      />
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className="text-sm flex items-center gap-1.5 font-medium"
            style={{
              borderColor: categoryColor,
              color: categoryColor,
              backgroundColor: `${categoryColor}10`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: categoryColor }}
            />
            {categoryName}
          </Badge>
        </div>
        <CardTitle className="text-xl">{quiz.titre}</CardTitle>
        <CardDescription>{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Badge
            variant={getLevelColor(quiz.niveau)}
            className={`text-sm ${getLevelBackgroundColor(quiz.niveau)}`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {quiz.niveau}
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Award className="w-4 h-4 mr-2" />
            {quiz.points} pts
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
