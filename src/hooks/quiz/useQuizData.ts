
import { useState, useEffect } from 'react';
import { quizFetchService } from '@/services/quiz/management/QuizFetchService';
import type { Quiz } from '@/types/quiz';
import { useToast } from '@/hooks/use-toast';

export const useQuizData = (quizId: string) => {
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setError('No quiz ID provided');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        console.log('Fetching quiz with ID:', quizId);
        const quizData = await quizFetchService.getQuizById(quizId);
        
        if (!quizData) {
          setError('Quiz not found');
          setIsLoading(false);
          return;
        }
        
        if (!quizData.questions || quizData.questions.length === 0) {
          setError('No questions found for this quiz');
          setIsLoading(false);
          return;
        }
        
        // Log questions for debugging
        console.log(`Loaded ${quizData.questions.length} questions for quiz ${quizId}`);
        console.log('First question:', quizData.questions[0]);
        
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
