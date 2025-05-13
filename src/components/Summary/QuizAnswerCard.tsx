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
}

export default function QuizAnswerCard({
  question,
  userAnswer,
}: QuizAnswerCardProps) {
  const userResponse = formatAnswer(question, userAnswer);
  const questionText = question.text;
  const correctResponse = formatCorrectAnswer(question);
  const isCorrect = isAnswerCorrect(question, userAnswer);

  return (
    <div className="p-4 mb-4 rounded-2xl shadow-lg bg-white">
  {/* Question Text */}
  <h3 className="text-xl font-bold mb-4 text-gray-800">{questionText}</h3>

  {/* Grid for Responses */}
  <div className="grid grid-cols-2 gap-4">
    {/* Correct Response */}
    <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-500">
      <CheckCircle className="text-green-500 mr-2" size={24} />
      <div>
        <h4 className="font-semibold text-lg">Bonne réponse</h4>
        <p className="text-base font-medium text-green-600">{correctResponse}</p>
      </div>
    </div>

    {/* User Response */}
    <div
      className={`flex items-center p-4 rounded-lg ${
        isCorrect ? "bg-green-50 border border-green-500" : "bg-red-50 border border-red-500"
      }`}
    >
      {isCorrect ? (
        <CheckCircle className="text-green-500 mr-2" size={24} />
      ) : (
        <XCircle className="text-red-500 mr-2" size={24} />
      )}
      <div>
        <h4
          className={`font-semibold text-lg ${
            isCorrect ? "text-green-700" : "text-red-700"
          }`}
        >
          Votre réponse
        </h4>
        <p
          className={`text-base font-medium ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {userResponse}
        </p>
      </div>
    </div>
  </div>
</div>

  );
}
