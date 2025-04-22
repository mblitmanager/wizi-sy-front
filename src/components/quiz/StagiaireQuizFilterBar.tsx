
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import type { Category } from "@/services/QuizService";
import React from "react";

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
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les catégories</SelectItem>
          {categories?.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedLevel} onValueChange={setSelectedLevel}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Niveau" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les niveaux</SelectItem>
          {levels.map((level) => (
            <SelectItem key={level} value={level}>
              {level}
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
