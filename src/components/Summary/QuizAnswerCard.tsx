import { Question } from "@/types/quiz";
import {
  formatAnswer,
  formatCorrectAnswer,
  isAnswerCorrect,
} from "@/use-case/hooks/summary/useQuizSummary";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizAnswerCardProps {
  question: Question;
  userAnswer:
    | string
    | number
    | Record<string, string | number>
    | Array<string | number>
    | null
    | undefined;
  isPlayed?: boolean;
  index?: number; // Ajout d'un index pour l'alternance
}

export default function QuizAnswerCard({
  question,
  userAnswer,
  isPlayed,
  questionNumber,
  index = 0, // Index par défaut à 0
}: QuizAnswerCardProps & { questionNumber?: number; index?: number }) {
  const userResponse = formatAnswer(question, userAnswer);
  const questionText = question.text;
  const correctResponse = formatCorrectAnswer(question);
  const isCorrect = isAnswerCorrect(question, userAnswer);

  const backgroundColorClass =
    index % 2 === 0
      ? "bg-gray-200 dark:bg-gray-800/50" // Index pair = gris
      : "bg-gray-50 dark:bg-gray-800";

  return (
    <div
      className={`p-5 mb-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 ${backgroundColorClass}`}>
      {/* En-tête de la question avec numéro */}
      <div className="flex items-start gap-3 mb-4">
        {questionNumber && (
          <div className="flex-shrink-0 w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              {questionNumber}
            </span>
          </div>
        )}
        <h3
          style={{ fontSize: "1rem" }}
          className="font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
          {questionText}
        </h3>
      </div>

      {/* Grid pour les réponses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Réponse correcte */}
        <div className="flex items-start p-4 bg-white dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mr-3 mt-0.5">
            <CheckCircle
              className="text-green-600 dark:text-green-400"
              size={14}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Réponse correcte :
              </h4>
              <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                {correctResponse}
              </span>
            </div>
          </div>
        </div>

        {/* Réponse utilisateur */}
        <div className="flex items-start p-4 bg-white dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-600">
          <div
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
              isCorrect
                ? "bg-green-100 dark:bg-green-900/40"
                : "bg-red-100 dark:bg-red-900/40"
            }`}>
            {isCorrect ? (
              <CheckCircle
                className="text-green-600 dark:text-green-400"
                size={14}
              />
            ) : (
              <XCircle className="text-red-600 dark:text-red-400" size={14} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Votre réponse :
              </h4>
              <span
                className={`text-xs font-semibold ${
                  isCorrect
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}>
                {userResponse}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de statut */}
      <div
        className={`mt-4 px-4 py-2 rounded-lg border text-center ${
          isCorrect
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
        }`}>
        <span className="text-sm font-medium">
          {isCorrect ? "✓ Bonne réponse" : "✗ Mauvaise réponse"}
        </span>
      </div>
    </div>
  );
}
