
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { QuizPlay } from "@/components/quiz/QuizPlay";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { quizManagementService } from "@/services/quiz/QuizManagementService";
import { useEffect } from "react";

const Quiz = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { token, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Vérification de l'ID du quiz
  useEffect(() => {
    if (!quizId) {
      console.error('No quiz ID provided');
      navigate('/quizzes');
      return;
    }
  }, [quizId, navigate]);

  // Fetch quiz details to validate if it exists
  const { data: quiz, isLoading: quizLoading, error: quizError } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => {
      if (!quizId) throw new Error('No quiz ID provided');
      return quizManagementService.getQuizById(quizId);
    },
    enabled: !!quizId && !!token,
    retry: 1,
    meta: {
      onError: (error) => {
        toast({
          title: "Erreur",
          description: "Impossible de charger ce quiz. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    }
  });

  // Si l'authentification est en cours de chargement, afficher un écran de chargement
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Vérification de l'authentification...</p>
        </div>
      </Layout>
    );
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si le quiz est en cours de chargement
  if (quizLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Chargement du quiz...</p>
        </div>
      </Layout>
    );
  }

  // Si une erreur s'est produite lors du chargement du quiz
  if (quizError) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur lors du chargement du quiz</AlertTitle>
            <AlertDescription>
              Nous n'avons pas pu charger ce quiz. Il est possible que le quiz n'existe pas ou que vous n'ayez pas accès à celui-ci.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={() => navigate('/quizzes')}
              variant="outline"
            >
              Retourner à la liste des quiz
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Si le quiz n'existe pas
  if (!quiz) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Quiz non trouvé</AlertTitle>
            <AlertDescription>
              Le quiz que vous recherchez n'existe pas ou a été supprimé.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={() => navigate('/quizzes')}
              variant="outline"
            >
              Retourner à la liste des quiz
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <QuizPlay />
      </div>
    </Layout>
  );
};

export default Quiz;
