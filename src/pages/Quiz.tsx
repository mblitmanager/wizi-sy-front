
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { QuizPlay } from "@/components/quiz/QuizPlay";
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <QuizPlay />
      </div>
    </Layout>
  );
};

export default Quiz;
