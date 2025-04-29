
import { useLocation, useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { QuizSummary } from './QuizSummary';
import { useToast } from '@/hooks/use-toast';
import { quizSubmissionService } from '@/services/quiz/QuizSubmissionService';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationBanner } from './NotificationBanner';

export function QuizResults() {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const { toast } = useToast();
  const { notifyQuizCompleted, permission } = useNotifications();
  
  // Store result state locally to avoid triggering re-renders
  const [result, setResult] = useState<any>(null);
  const [notificationSent, setNotificationSent] = useState(false);
  
  // Check if the result was passed through navigation state
  const resultFromState = location.state?.result;

  // If we don't have the result from state, fetch it from the API
  const { data: resultFromApi, isLoading, error } = useQuery({
    queryKey: ['quiz-result', quizId],
    queryFn: () => quizSubmissionService.getQuizResult(quizId as string),
    enabled: !!quizId && !resultFromState && !!localStorage.getItem('token')
  });

  console.log("Result from state:", resultFromState);
  console.log("Result from API:", resultFromApi);

  // Use useEffect to set the result once to avoid infinite loops
  useEffect(() => {
    if (resultFromState) {
      setResult(resultFromState);
    } else if (resultFromApi) {
      setResult(resultFromApi);
    }
  }, [resultFromState, resultFromApi]);
  
  // Handle notifications for quiz results
  useEffect(() => {
    if (result && permission === 'granted' && !notificationSent) {
      notifyQuizCompleted(result.correctAnswers, result.totalQuestions);
      setNotificationSent(true);
    }
  }, [result, permission, notificationSent, notifyQuizCompleted]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les résultats du quiz.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading || (!result && !error)) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex items-center justify-center flex-col gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <h1 className="text-2xl font-bold">Chargement des résultats...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Résultats non disponibles</h1>
          <p className="mb-4">Les résultats de ce quiz ne sont pas disponibles.</p>
          <Button asChild>
            <Link to="/quizzes">Retour aux quiz</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Format data for QuizSummary component
  const formattedUserAnswers: Record<string, any> = {};
  result.questions.forEach((q: any) => {
    if (q.selectedAnswers && Array.isArray(q.selectedAnswers)) {
      formattedUserAnswers[q.id] = q.selectedAnswers;
    } else if (q.selectedAnswers && typeof q.selectedAnswers === 'object') {
      formattedUserAnswers[q.id] = q.selectedAnswers;
    } else if (q.selectedAnswers) {
      formattedUserAnswers[q.id] = q.selectedAnswers;
    } else {
      // Fallback pour les anciens formats de donnée
      formattedUserAnswers[q.id] = null;
    }
  });

  const quizData = {
    id: result.quizId || result.quiz?.id,
    titre: result.quiz?.titre || "Quiz",
    description: result.quiz?.description || "",
    categorie: result.quiz?.categorie || "",
    categorieId: result.quiz?.categorieId || "",
    niveau: result.quiz?.niveau || "",
    points: result.quiz?.points || 0
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 lg:py-8 lg:max-w-4xl">
        <NotificationBanner />
        
        <div className="mb-10 p-6 border rounded-lg bg-card shadow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground uppercase">Score</p>
              <p className="text-3xl font-bold">{result.score}%</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground uppercase">Bonnes réponses</p>
              <p className="text-3xl font-bold">{result.correctAnswers} / {result.totalQuestions}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground uppercase">Temps passé</p>
              <p className="text-3xl font-bold">{Math.floor(result.timeSpent / 60)}:{(result.timeSpent % 60).toString().padStart(2, '0')}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground uppercase">Complété le</p>
              <p className="text-3xl font-bold">{new Date(result.completedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <QuizSummary 
          questions={result.questions} 
          quiz={quizData} 
          userAnswers={formattedUserAnswers} 
          score={result.score} 
          totalQuestions={result.totalQuestions}
        />
      </div>
    </Layout>
  );
}
