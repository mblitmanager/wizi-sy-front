
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
  if (!categories) return '#000000';
  const category = categories.find(c => c.id === categoryId);
  if (!category) return '#000000';
  switch (category.name.toLowerCase()) {
    case 'bureautique':
      return '#3D9BE9';
    case 'langues':
      return '#A55E6E';
    case 'internet':
      return '#FFC533';
    case 'création':
      return '#9392BE';
    default:
      return '#000000';
  }
};

interface StagiaireQuizCardProps {
  quiz: Quiz;
  categories: Category[] | undefined;
}

export function StagiaireQuizCard({ quiz, categories }: StagiaireQuizCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow relative">
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
        style={{
          backgroundColor: getCategoryColor(quiz.categorieId, categories)
        }}
      />
      <CardHeader>
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
          {categories && (
            <Badge
              variant="outline"
              className="text-sm"
              style={{
                borderColor: categories.find(c => c.id === quiz.categorieId)?.color || '#000',
                color: categories.find(c => c.id === quiz.categorieId)?.color || '#000'
              }}
            >
              {categories.find(c => c.id === quiz.categorieId)?.name || quiz.categorie}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
