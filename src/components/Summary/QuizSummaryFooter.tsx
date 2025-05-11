import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, LayoutList } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuizSummaryFooterProps {
  quizId: string;
}

export default function QuizSummaryFooter({ quizId }: QuizSummaryFooterProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-3">
      <Button
        onClick={() => navigate("/quizzes")}
        variant="outline"
        className="flex-1 min-w-[110px] px-4 py-2 text-sm rounded-full hover:bg-muted transition bg-gold"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Nouveau quiz
      </Button>

      <Button
        onClick={() => navigate(`/quiz/${quizId}`)}
        className="flex-1 min-w-[110px] px-4 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary/90 transition"
      >
        <CheckCircle2 className="h-4 w-4 mr-1" />
        Recommencer
      </Button>

      <Button
        onClick={() => navigate(`/classement`)}
        variant="outline"
        className="flex-1 min-w-[110px] px-4 py-2 text-sm rounded-full hover:bg-muted transition bg-gold"
      >
        <LayoutList className="h-4 w-4 mr-1" />
        {/* <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-1" /> */}
        Classement
      </Button>
    </div>
  );
}
