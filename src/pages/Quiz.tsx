
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { QuizGame } from "@/components/quiz/QuizGame";

const Quiz = () => {
  const { quizId } = useParams();
  
  const { data: questions, isLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/api/quiz/${quizId}/questions`);
      if (!response.ok) throw new Error("Failed to fetch questions");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p>Chargement du quiz...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <QuizGame questions={questions} />
      </div>
    </Layout>
  );
};

export default Quiz;
