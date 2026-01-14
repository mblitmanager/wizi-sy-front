import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, Clock, Play, History } from "lucide-react";
import type { Quiz, Category, QuizHistory } from "@/types/quiz";
import React from "react";
import { stripHtmlTags } from "@/utils/UtilsFunction";
import { useNavigate } from "react-router-dom";
import bureatique from "../../assets/icons/bureautique.png";
import internet from "../../assets/icons/internet.png";
import creation from "../../assets/icons/creation.png";
import langues from "../../assets/icons/langues.png";
import IA from "../../assets/icons/IA.png";

// Configuration des catégories (identique à votre code)
const CATEGORY_CONFIG = {
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
    icon: creation,
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

const getCategoryConfig = (categoryName: string) => {
  const lowerName = categoryName.toLowerCase();
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
  history?: QuizHistory[];
  onStartQuiz?: (quiz: Quiz) => void;
  onHistoryClick?: (e: React.MouseEvent, quiz: Quiz) => void;
}

export function QuizCard({
  quiz,
  categories,
  history,
  onStartQuiz,
  onHistoryClick,
}: QuizCardProps) {
  const navigate = useNavigate();
  const categoryName =
    quiz.formation?.categorie || quiz.categorie || "Non catégorisé";
  const categoryConfig = getCategoryConfig(categoryName);
  const levelConfig = getLevelConfig(quiz.niveau);
  const estimatedTime = quiz.questions?.length
    ? Math.ceil(quiz.questions.length * 0.5)
    : 5;
  const h = history?.find?.((x) => String(x.quizId || (x.quiz as any)?.id) === String(quiz.id));
  const timeSpent = h?.timeSpent || 0;
  const totalQuestions = h?.totalQuestions || quiz.questions?.length || 0;
  const correct = h?.correctAnswers || 0;
  const percent = totalQuestions
    ? Math.round((correct / totalQuestions) * 100)
    : 0;

  const handleStartQuiz = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If an external handler is provided, call it. Otherwise navigate to quiz page.
    if (onStartQuiz) {
      onStartQuiz(quiz);
      return;
    }
    navigate(`/quiz/${quiz.id}`);
  };

  const handleCardActivation = () => {
    if (onStartQuiz) {
      onStartQuiz(quiz);
    } else {
      navigate(`/quiz/${quiz.id}`);
    }
  };

  return (
    <Card
      onClick={handleCardActivation}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardActivation();
        }
      }}
      role="button"
      tabIndex={0}
      className={`cursor-pointer w-full h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${categoryConfig.borderColor} ${categoryConfig.bgColor}`}>
      {/* Bande de couleur de catégorie en haut */}
      <div
        className="h-2 w-full"
        style={{ backgroundColor: categoryConfig.color }}
      />

      <div className="p-4">
        {/* Header avec icône et titre */}
        <CardHeader className="p-0 mb-4 flex flex-row items-start gap-4">
          {categoryConfig.icon && (
            <div
              className="p-2 rounded-lg flex-shrink-0 mt-1"
              style={{ backgroundColor: `${categoryConfig.color}20` }}>
              <img
                src={categoryConfig.icon}
                alt={categoryName}
                className="w-6 h-6 object-contain"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="mb-2">
              {(() => {
                const title = quiz.titre;
                if (title && title.includes(":")) {
                  const [mainTitle, subTitle] = title
                    .split(":")
                    .map((part) => part.trim());
                  return (
                    <div className="space-y-1">
                      <div className="flex items-start gap-2 flex-wrap">
                        <span
                          className={`text-lg font-bold leading-tight ${categoryConfig.textColor} break-words`}>
                          {mainTitle}
                        </span>
                        <Badge
                          className={`text-xs font-medium ${categoryConfig.badgeColor} ${categoryConfig.textColor} px-2 py-1`}>
                          {categoryName}
                        </Badge>
                      </div>
                      <p className="text-sm font-bold text-gray-600 leading-relaxed break-words">
                        {subTitle}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="flex items-start gap-2 flex-wrap">
                    <span
                      className={`text-lg font-bold leading-tight ${categoryConfig.textColor} break-words`}>
                      {title}
                    </span>
                    {quiz.niveau && (
                      <span
                        className={`px-2 py-1 rounded ${levelConfig.bgClass} ${levelConfig.textClass} text-xs font-medium whitespace-nowrap mt-0.5`}>
                        {quiz.niveau}
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </CardHeader>

        {/* Description */}
        <CardDescription className="text-sm text-gray-600 line-clamp-2 mb-4">
          {stripHtmlTags(quiz.description) ||
            "Testez vos connaissances avec ce quiz interactif."}
        </CardDescription>

        {/* Footer avec métadonnées */}
        <CardContent className="p-0">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge
              className={`text-xs ${levelConfig.bgClass} ${levelConfig.textClass} flex items-center gap-1`}>
              <BookOpen className="w-3 h-3" />
              {quiz.niveau || "Niveau"}
            </Badge>

            <Badge
              variant="outline"
              className="text-xs flex items-center gap-1">
              <Award className="w-3 h-3" />
              {correct > 0
                ? `${correct} pts`
                : quiz.questions?.length
                ? `${Math.min(quiz.questions.length * 2, 10)} pts`
                : "0 pt"}
            </Badge>

            <Badge
              variant="outline"
              className="text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeSpent
                ? `${Math.floor(timeSpent / 60)} min ${(timeSpent % 60)
                    .toString()
                    .padStart(2, "0")} sec`
                : `${estimatedTime} min`}
            </Badge>
          </div>

          {/* Résultats précédents */}
          {h && (
            <div className="mb-3 text-xs text-gray-700 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                {correct/5*100} %
              </span>
              <span>
                {correct}/5 bonnes réponses
              </span>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-2 w-full mt-2">
            <Button
              onClick={handleStartQuiz}
              className={`flex-1 ${categoryConfig.buttonColor} text-white font-black italic uppercase tracking-widest py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md active:scale-95`}
              size="sm">
              <Play className="w-4 h-4" />
              {h ? "Rejouer" : "Jouer"}
            </Button>
            
            {(h || onHistoryClick) && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onHistoryClick?.(e, quiz);
                }}
                className="px-3 rounded-xl border-[#FFD700]/30 text-[#B8860B] font-black italic uppercase tracking-widest hover:bg-[#FFD700]/10 flex items-center gap-1.5"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Historique</span>
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
