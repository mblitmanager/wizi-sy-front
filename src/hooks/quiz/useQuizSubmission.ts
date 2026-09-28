import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { quizKeys } from "@/hooks/queries/useQuizQueries";
import { profileKeys } from "@/hooks/queries/useProfileQueries";
import { pointsKeys } from "@/hooks/useClassementPoints";
import { useToast } from "@/hooks/use-toast";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";

// hooks/quiz/useQuizSubmission.ts
export const useQuizSubmission = (quizId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitQuiz = async (
    answers: Record<string, any>,
    timeSpent: number,
    questions?: any[]
  ) => {
    setIsSubmitting(true);

    try {
      const result = await quizSubmissionService.submitQuiz(
        quizId,
        answers,
        timeSpent,
        questions
      );

      // Le quiz est terminé : statut "joué", déblocage du suivant, points et classements changent
      queryClient.invalidateQueries({ queryKey: quizKeys.stagiaireQuizzes });
      queryClient.invalidateQueries({ queryKey: profileKeys.quizHistory });
      queryClient.invalidateQueries({ queryKey: profileKeys.progress });
      queryClient.invalidateQueries({ queryKey: pointsKeys.me });
      queryClient.invalidateQueries({ queryKey: ["quiz", "classement"] });

      navigate(`/quiz/${quizId}/results`, {
        state: {
          result: {
            ...result,
            timeSpent: timeSpent, // Ensure timeSpent is explicitly passed
            completedAt: new Date().toISOString(), // Ensure date is passed
          },
          pointsPerQuestion: 2,
        },
      });
    } catch (error) {
      console.error("❌ SUBMISSION - Error:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du quiz.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitQuiz,
  };
};
