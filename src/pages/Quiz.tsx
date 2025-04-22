
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { QuizGame } from "@/components/quiz/QuizGame";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Quiz = () => {
  const { quizId } = useParams();
  const { token, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: questions, isLoading: questionsLoading, error } = useQuery({
    queryKey: ["quiz", quizId, "questions"],
    queryFn: async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/quiz/${quizId}/questions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Failed to fetch questions:", errorData);
          throw new Error(errorData.message || "Failed to fetch questions");
        }
        
        return response.json();
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les questions. Veuillez réessayer.",
          variant: "destructive"
        });
        throw error;
      }
    },
    enabled: !!token && !!quizId,
    retry: 1
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

  // Si les questions sont en cours de chargement
  if (questionsLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Chargement du quiz...</p>
        </div>
      </Layout>
    );
  }

  // Si une erreur s'est produite lors du chargement des questions
  if (error || !questions || questions.length === 0) {
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <QuizGame questions={questions || []} />
      </div>
    </Layout>
  );
};

export default Quiz;
