
import { useState, useEffect } from 'react';
import { quizManagementService } from '@/services/quiz/QuizManagementService';
import type { Quiz } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';

export const useQuizData = (quizId: string) => {
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const quizData = await quizManagementService.getQuizById(quizId);
        
        if (!quizData) {
          setError('Quiz not found');
          return;
        }
        
        if (!quizData.questions || quizData.questions.length === 0) {
          setError('No questions found for this quiz');
          return;
        }
        
        setQuiz(quizData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load quiz data',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, toast]);

  return {
    quiz,
    isLoading,
    error
  };
};
