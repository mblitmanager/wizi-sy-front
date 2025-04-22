import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award } from "lucide-react";
import type { Quiz, Category } from "@/services/QuizService";
import React from "react";

// Helpers copied from original file for detaching style logic

const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'débutant':
      return 'secondary';
    case 'intermédiaire':
      return 'default';
    case 'avancé':
    case 'super quiz':
      return 'destructive';
    default:
      return 'outline';
  }
};

const getLevelBackgroundColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'débutant':
      return 'bg-green-100 text-green-800';
    case 'intermédiaire':
      return 'bg-blue-100 text-blue-800';
    case 'avancé':
    case 'super quiz':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return '';
  }
};

// Use the same rules as before for category color
const getCategoryColor = (categoryId: string, categories: Category[] | undefined) => {
  if (!categories) return '#3B82F6'; // Couleur par défaut bleu
  const category = categories.find(c => c.id === categoryId);
  
  // Si on a la couleur de la catégorie depuis l'API, on l'utilise
  if (category?.color) return category.color;
  
  // Sinon on utilise des couleurs par défaut selon le nom de la catégorie
  if (category?.name) {
    switch (category.name.toLowerCase()) {
      case 'bureautique':
        return '#3B82F6'; // Bleu
      case 'langues':
        return '#EC4899'; // Rose
      case 'internet':
        return '#F59E0B'; // Orange
      case 'création':
        return '#8B5CF6'; // Violet
      case 'anglais':
        return '#10B981'; // Vert
      case 'français':
        return '#EF4444'; // Rouge
      case 'excel':
        return '#6366F1'; // Indigo
      default:
        return '#3B82F6'; // Bleu par défaut
    }
  }
  
  // Si on n'a pas de catégorie, on utilise la couleur par défaut
  return '#3B82F6';
};

interface StagiaireQuizCardProps {
  quiz: Quiz;
  categories: Category[] | undefined;
}

export function StagiaireQuizCard({ quiz, categories }: StagiaireQuizCardProps) {
  const category = categories?.find(c => c.id === quiz.categorieId);
  const categoryName = category?.name || quiz.categorie;
  const categoryColor = getCategoryColor(quiz.categorieId, categories);

  return (
    <Card className="h-full hover:shadow-lg transition-shadow relative">
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
        style={{
          backgroundColor: categoryColor
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
              backgroundColor: `${categoryColor}10`
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
