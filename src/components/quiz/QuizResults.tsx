
import { useLocation, useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { QuizSummary } from './QuizSummary';
import { useToast } from '@/hooks/use-toast';
import { quizSubmissionService } from '@/services/quiz/QuizSubmissionService';
import { useQuery } from '@tanstack/react-query';

export function QuizResults() {
  const { quizId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check if the result was passed through navigation state
  const resultFromState = location.state?.result;

  // If we don't have the result from state, fetch it from the API
  const { data: resultFromApi, isLoading, error } = useQuery({
    queryKey: ['quiz-result', quizId],
    queryFn: () => quizSubmissionService.getQuizResult(quizId as string),
    enabled: !!quizId && !resultFromState && !!localStorage.getItem('token')
  });

  // Use the result from state if available, otherwise use the result from API
  const result = resultFromState || resultFromApi;

  // Handle API errors
  if (error) {
    toast({
      title: "Erreur",
      description: "Impossible de charger les résultats du quiz.",
      variant: "destructive",
    });
  }

  if (isLoading || (!result && !error)) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-4">Chargement des résultats...</h1>
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
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

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Résultats du quiz</h1>
        
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
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/quizzes">Retour aux quiz</Link>
            </Button>
            <Button asChild>
              <Link to={`/quiz/${quizId}`}>Détails du quiz</Link>
            </Button>
          </div>
        </div>
        
        <QuizSummary 
          questions={result.questions} 
          quiz={result.quiz || {}} 
          userAnswers={result.userAnswers || []} 
          score={result.score} 
          totalQuestions={result.totalQuestions}
        />
      </div>
    </Layout>
  );
}
