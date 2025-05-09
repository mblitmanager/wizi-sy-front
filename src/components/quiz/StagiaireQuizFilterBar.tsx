
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal, ListFilter } from "lucide-react";
import type { Category } from "@/types/quiz";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  showCompleted?: boolean;
  setShowCompleted?: (show: boolean) => void;
}

export function StagiaireQuizFilterBar({
  categories,
  levels,
  selectedCategory,
  selectedLevel,
  setSelectedCategory,
  setSelectedLevel,
  showCompleted = true,
  setShowCompleted
}: QuizFilterBarProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <SlidersHorizontal className="h-5 w-5 text-primary" />
          </motion.div>
          <span className="text-base font-medium text-gray-700">Filtrer les quiz</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="flex items-center gap-1"
        >
          <ListFilter className="h-4 w-4" />
          {filtersExpanded ? "Moins d'options" : "Plus d'options"}
        </Button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: filtersExpanded ? 'auto' : '0', opacity: filtersExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Catégorie */}
          <div>
            <p className="mb-2 text-sm text-gray-500">Catégorie</p>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {selectedCategory === "all" ? (
                    "Toutes les catégories"
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: getCategoryColor(selectedCategory, categories)
                        }}
                      />
                      {categories?.find(c => c.id === selectedCategory)?.name || "Catégorie"}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <SelectItem value="all">
                  <span className="text-gray-600">Toutes les catégories</span>
                </SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ 
                          backgroundColor: category.color || getCategoryColor(category.id, categories)
                        }}
                      />
                      <span className="font-medium" style={{ color: category.color || getCategoryColor(category.id, categories) }}>
                        {category.name}
                      </span>
                      {category.quizCount && (
                        <span className="text-xs text-gray-500 ml-1">({category.quizCount})</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Niveau */}
          <div>
            <p className="mb-2 text-sm text-gray-500">Niveau</p>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {selectedLevel === "all" ? (
                    "Tous les niveaux"
                  ) : (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
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
                        className="w-3 h-3 rounded-full"
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
          </div>

          {/* Show Completed Switch */}
          {setShowCompleted && (
            <div className="flex items-center space-x-2">
              <Switch
                id="show-completed"
                checked={showCompleted}
                onCheckedChange={setShowCompleted}
              />
              <Label htmlFor="show-completed" className="text-sm text-gray-700">
                Afficher les quiz déjà complétés
              </Label>
            </div>
          )}
        </div>

        {(selectedCategory !== "all" || selectedLevel !== "all") && (
          <div className="flex justify-end mt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                Réinitialiser les filtres
              </Button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
