import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuizSummaryHeaderProps {
  onBack: () => void;
  score: number;
}

export default function QuizSummaryHeader({
  onBack,
  score,
}: QuizSummaryHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
      {/* <Button variant="ghost" onClick={onBack}>
        <ChevronLeft className="mr-2 h-5 w-5" /> Retour
      </Button> */}
      <h2 className="text-lg font-semibold">Résumé du Quiz</h2>
      <div className="text-xl font-bold text-primary">{score} / 10</div>
    </div>
  );
}
