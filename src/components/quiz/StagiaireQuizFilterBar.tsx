import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import type { Category } from "@/types/quiz";
import React from "react";

// Helpers pour la coloration
const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'débutant':
      return '#22C55E'; // Vert
    case 'intermédiaire':
      return '#3B82F6'; // Bleu
    case 'avancé':
    case 'super quiz':
      return '#EF4444'; // Rouge
    default:
      return '#6B7280'; // Gris par défaut
  }
};

const getLevelBackgroundColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'débutant':
      return '#DCF9E6'; // Vert clair
    case 'intermédiaire':
      return '#DBEAFE'; // Bleu clair
    case 'avancé':
    case 'super quiz':
      return '#FEE2E2'; // Rouge clair
    default:
      return '#F3F4F6'; // Gris clair
  }
};

const getCategoryColor = (categoryId: string, categories: Category[] | undefined) => {
  if (!categories) return '#3B82F6';
  const category = categories.find(c => c.id === categoryId);
  
  if (category?.color) return category.color;
  
  if (category?.name) {
    switch (category.name.toLowerCase()) {
      case 'bureautique':
        return '#3B82F6';
      case 'langues':
        return '#EC4899';
      case 'internet':
        return '#F59E0B';
      case 'création':
        return '#8B5CF6';
      case 'anglais':
        return '#10B981';
      case 'français':
        return '#EF4444';
      case 'excel':
        return '#6366F1';
      case 'IA':
        return '#ABDA96';
      default:
        return '#3B82F6';
    }
  }
  
  return '#3B82F6';
};

interface QuizFilterBarProps {
  categories: Category[] | undefined;
  levels: string[];
  selectedCategory: string;
  selectedLevel: string;
  setSelectedCategory: (cat: string) => void;
  setSelectedLevel: (lvl: string) => void;
}

export function StagiaireQuizFilterBar({
  categories,
  levels,
  selectedCategory,
  selectedLevel,
  setSelectedCategory,
  setSelectedLevel
}: QuizFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-500">Filtrer par:</span>
      </div>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue>
            {selectedCategory === "all" ? (
              "Toutes les catégories"
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: getCategoryColor(selectedCategory, categories)
                  }}
                />
                {categories?.find(c => c.id === selectedCategory)?.name || "Catégorie"}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <span className="text-gray-600">Toutes les catégories</span>
          </SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: category.color || getCategoryColor(category.id, categories)
                  }}
                />
                <span style={{ color: category.color || getCategoryColor(category.id, categories) }}>
                  {category.name}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedLevel} onValueChange={setSelectedLevel}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue>
            {selectedLevel === "all" ? (
              "Tous les niveaux"
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getLevelColor(selectedLevel) }}
                />
                {selectedLevel}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <span className="text-gray-600">Tous les niveaux</span>
          </SelectItem>
          {levels.map((level) => (
            <SelectItem key={level} value={level}>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getLevelColor(level) }}
                />
                <span style={{ 
                  color: getLevelColor(level),
                  backgroundColor: getLevelBackgroundColor(level),
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {level}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(selectedCategory !== "all" || selectedLevel !== "all") && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedCategory("all");
            setSelectedLevel("all");
          }}
        >
          Réinitialiser
        </Button>
      )}
    </div>
  );
}
