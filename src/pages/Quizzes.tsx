import { Layout } from "@/components/layout/Layout";
import { QuizList } from "@/components/quiz/QuizList";
import { useQuery } from "@tanstack/react-query";
import { quizService } from "@/services/QuizService";
import { Loader2 } from "lucide-react";

export default function Quizzes() {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["quiz-categories"],
    queryFn: () => quizService.getCategories()
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Quiz disponibles</h1>
        
        {categoriesLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <QuizList />
        )}
      </div>
    </Layout>
  );
} 