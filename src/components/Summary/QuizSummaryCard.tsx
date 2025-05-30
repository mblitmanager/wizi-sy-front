import { Trophy } from "lucide-react";

interface QuizSummaryCardProps {
  score: number;
  totalQuestions: number;
}

export default function QuizSummaryCard({
  score,
  totalQuestions,
}: QuizSummaryCardProps) {
  const isSuccess = score >= totalQuestions / 2;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-xl">
      <Trophy
        className={`h-8 w-8 ${isSuccess ? "text-green-500" : "text-red-500"}`}
      />
      <h3 className="mt-3 text-xl font-bold">
        {isSuccess ? "Bravo !" : "Réessayez !"}
      </h3>
      {/* <p className="text-gray-600 mt-1 text-sm">
        Vous avez obtenu {score} points. */}
        {/* / {totalQuestions}  */}
         {/* points. */}
      {/* </p> */}
    </div>
  );
}
