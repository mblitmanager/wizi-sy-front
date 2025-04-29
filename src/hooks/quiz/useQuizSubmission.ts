
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizSubmissionService } from '@/services/quiz/QuizSubmissionService';
import { useToast } from '@/hooks/use-toast';

export const useQuizSubmission = (quizId: string) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitQuiz = async (answers: Record<string, string[]>, timeSpent: number) => {
    if (!quizId) return;
    
    try {
      setIsSubmitting(true);
      const result = await quizSubmissionService.submitQuiz(quizId, answers, timeSpent);
      setIsSubmitting(false);
      
      // Navigate to results page
      navigate(`/quiz/${quizId}/results`, { state: { result } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setIsSubmitting(false);
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    isSubmitting,
    submitQuiz
  };
};
