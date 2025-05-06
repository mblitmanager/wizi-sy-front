
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { quizSubmissionService } from '@/services/quiz/QuizSubmissionService';

export const useQuizSubmission = (quizId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const submitQuiz = async (answers: Record<string, string[]>, timeSpent: number) => {
    setIsSubmitting(true);
    
    try {
      const result = await quizSubmissionService.submitQuiz(quizId, answers, timeSpent);
      
      // Calculate score and navigate to results page
      navigate(`/quiz/${quizId}/results`, {
        state: {
          result,
          pointsPerQuestion: 2 // Fixed at 2 points per question
        }
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la soumission du quiz.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitQuiz
  };
};
