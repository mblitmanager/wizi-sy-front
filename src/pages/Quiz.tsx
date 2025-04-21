import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { QuizGame } from "@/components/quiz/QuizGame";
import { useAuth } from "@/hooks/useAuth";

const Quiz = () => {
  const { quizId } = useParams();
  const { token, isLoading: authLoading } = useAuth();
  
  const { data: questions, isLoading: questionsLoading, error } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/api/quiz/${quizId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error("Failed to fetch questions");
      return response.json();
    },
    enabled: !!token && !!quizId
  });

  // Si l'authentification est en cours de chargement, afficher un écran de chargement
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Vérification de l'authentification...</p>
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
          <p>Chargement du quiz...</p>
        </div>
      </Layout>
    );
  }

  // Si une erreur s'est produite lors du chargement des questions
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-red-500">Erreur lors du chargement du quiz</p>
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
