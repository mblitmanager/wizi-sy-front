
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { quizSubmissionService } from '@/services/quiz/QuizSubmissionService';

// hooks/quiz/useQuizSubmission.ts
export const useQuizSubmission = (quizId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const submitQuiz = async (answers: Record<string, string[]>, timeSpent: number) => {
    console.log('🎯 FINAL SUBMISSION DATA:', {
    timeSpent: timeSpent,
    answersCount: Object.keys(answers).length,
    answers: answers,
    timestamp: new Date().toISOString()
  });
    setIsSubmitting(true);
    
    try {
      const result = await quizSubmissionService.submitQuiz(quizId, answers, timeSpent);
      
      
      
      navigate(`/quiz/${quizId}/results`, {
        state: {
          result,
          pointsPerQuestion: 2
        }
      });
    } catch (error) {
      console.error('❌ SUBMISSION - Error:', error);
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
