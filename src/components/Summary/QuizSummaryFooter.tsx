import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuizSummaryFooterProps {
  quizId: string;
  score?: number;
  quizTitle?: string;
}

export default function QuizSummaryFooter({ quizId, score, quizTitle }: QuizSummaryFooterProps) {
  const navigate = useNavigate();

  const handleShare = async () => {
    const shareData = {
      title: `Quiz: ${quizTitle || 'Résultat'}`,
      text: `J'ai obtenu ${score ?? 0} points sur le quiz "${quizTitle}"! 🎉 Testez-vous aussi sur Wizi Learn!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      alert('Lien copié !');
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-3">
      <Button
        onClick={() => navigate("/quizzes")}
        variant="outline"
        className="flex-1 min-w-[110px] px-4 py-2 text-sm rounded-full hover:bg-muted transition bg-gold">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Nouveau quiz
      </Button>

      <Button
        onClick={handleShare}
        className="px-6 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
        <Share2 className="h-4 w-4 mr-2" />
        PARTAGER MON RÉSULTAT
      </Button>

      <Button
        onClick={() => navigate(`/quiz/${quizId}`)}
        className="flex-1 min-w-[110px] px-4 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary/90 transition">
        <CheckCircle2 className="h-4 w-4 mr-1" />
        Recommencer
      </Button>
    </div>
  );
}
