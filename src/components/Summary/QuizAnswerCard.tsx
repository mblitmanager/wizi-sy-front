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
  isPlayed?: boolean; // Ajout du flag isPlayed
}

export default function QuizAnswerCard({
  question,
  userAnswer,
  isPlayed,
  questionNumber, // Ajout du paramètre optionnel
}: QuizAnswerCardProps & { questionNumber?: number }) {
  const userResponse = formatAnswer(question, userAnswer);
  const questionText = question.text;
  const correctResponse = formatCorrectAnswer(question);
  const isCorrect = isAnswerCorrect(question, userAnswer);

  console.log("QuizAnswerCard", isCorrect);

  return (
    <div className="p-4 mb-3 rounded-xl shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      {/* Question Text */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {questionText}
        </h3>
      </div>
      {/* Grid for Responses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Correct Response */}
        <div className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle
            className="flex-shrink-0 text-green-500 dark:text-green-400 mt-0.5 mr-2"
            size={18}
          />
          <div>
            <h4 className="text-sm font-medium text-green-700 dark:text-green-300">
              Réponse correcte
            </h4>
            <p className="text-sm font-normal text-green-600 dark:text-green-200">
              {correctResponse}
            </p>
          </div>
        </div>

        {/* User Response */}
        <div
          className={`flex items-start p-3 rounded-lg border ${
            isCorrect
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}>
          {isCorrect ? (
            <CheckCircle
              className="flex-shrink-0 text-green-500 dark:text-green-400 mt-0.5 mr-2"
              size={18}
            />
          ) : (
            <XCircle
              className="flex-shrink-0 text-red-500 dark:text-red-400 mt-0.5 mr-2"
              size={18}
            />
          )}
          <div>
            <h4
              className={`text-sm font-medium ${
                isCorrect
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}>
              Votre réponse
            </h4>
            <p
              className={`text-sm font-normal ${
                isCorrect
                  ? "text-green-600 dark:text-green-200"
                  : "text-red-600 dark:text-red-200"
              }`}>
              {userResponse}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
