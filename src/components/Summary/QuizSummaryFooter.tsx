import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Question } from "@/types/quiz";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface QuizSummaryFooterProps {
  quizId: string;
  score?: number;
  quizTitle?: string;
  questions?: Question[];
  userAnswers?: Record<
    string,
    string | number | Record<string, string | number> | (string | number)[] | null | undefined
  >;
}

export default function QuizSummaryFooter({ quizId, score, quizTitle, questions, userAnswers }: QuizSummaryFooterProps) {
  const navigate = useNavigate();
  const [shareWithAnswers, setShareWithAnswers] = useState(false);

  const getAnswerText = (question: Question, answerId: string | number | null | undefined): string => {
    if (!answerId) return "Pas de réponse";
    if (Array.isArray(answerId)) return answerId.map(id => getAnswerText(question, id)).join(", ");
    
    // For simple choice questions
    if (question.answers) {
      const found = question.answers.find(a => a.id.toString() === answerId.toString());
      return found ? found.text : answerId.toString();
    }
    return answerId.toString();
  };

  const formatDetailedResults = () => {
    if (!questions || !userAnswers) return "";

    let details = "\n\n--- Détails des réponses ---\n";
    
    const correctQuestions: string[] = [];
    const incorrectQuestions: string[] = [];

    questions.forEach((q, index) => {
      const userAnswer = userAnswers[q.id];
      // Logic from QuizAnswerCard to determine correctness roughly
      // This is simplified; ideally we should rely on backend or robust frontend validation
      // But we can check provided `isCorrect` prop if available or use simple matching
      
      const userAnswerId = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
      const correctAnswer = q.answers?.find(a => a.isCorrect || a.is_correct || a.reponse_correct);
      
      const isCorrectLegacy = q.isCorrect; // From backend result
      
      const userAnswerText = getAnswerText(q, userAnswerId as string | number);
      const correctAnswerText = correctAnswer ? correctAnswer.text : "N/A";

      let text = `Q${index + 1}: ${q.text}\n`;
      text += `Ma réponse: ${userAnswerText}\n`;
      
      if (isCorrectLegacy !== false && (isCorrectLegacy === true || (correctAnswer && userAnswerId?.toString() === correctAnswer.id.toString()))) {
         text += "✅ Correcte\n";
         correctQuestions.push(text);
      } else {
         text += `❌ Incorrecte (Bonne réponse: ${correctAnswerText})\n`;
         incorrectQuestions.push(text);
      }
    });

    if (correctQuestions.length > 0) {
      details += "\n-- Bonnes réponses --\n" + correctQuestions.join("\n");
    }
    if (incorrectQuestions.length > 0) {
      details += "\n-- Mauvaises réponses --\n" + incorrectQuestions.join("\n");
    }

    return details;
  };

  const handleShare = async () => {
    let text = `J'ai obtenu ${score ?? 0} points sur le quiz "${quizTitle}"! 🎉 Testez-vous aussi sur Wizi Learn!`;
    
    if (shareWithAnswers && questions && userAnswers) {
      text += formatDetailedResults();
    }

    const shareData = {
      title: `Quiz: ${quizTitle || 'Résultat'}`,
      text: text,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.url}`);
      alert('Résultat copié dans le presse-papier !');
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-3 w-full">
      {questions && userAnswers && (
        <div className="flex items-center space-x-2 mb-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
          <Checkbox 
            id="share-details" 
            checked={shareWithAnswers}
            onCheckedChange={(checked) => setShareWithAnswers(checked as boolean)}
          />
          <Label 
            htmlFor="share-details" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            Inclure le détail des questions/réponses
          </Label>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 w-full">
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
          PARTAGER
        </Button>

        <Button
          onClick={() => navigate(`/quiz/${quizId}`)}
          className="flex-1 min-w-[110px] px-4 py-2 text-sm bg-primary text-white rounded-full hover:bg-primary/90 transition">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Recommencer
        </Button>
      </div>
    </div>
  );
}
