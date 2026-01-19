import { useEffect, useState } from "react";
import { quizService } from "@/services/quizServiceA";
import { QuizResult, Category } from "@/types/quiz";
import { useUser } from "@/hooks/useAuth";

export const useLoadQuizData = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useUser();

  useEffect(() => {
    // Skip if user is formateur/formatrice as they don't have student quiz data
    const role = user?.role || (user as any)?.user?.role;
    if (role === "formateur" || role === "formatrice") {
      return;
    }

    const fetchQuizData = async () => {
      try {
        const [quizResults, rawCategories] = await Promise.all([
          quizService.getUserResults(),
          quizService.getQuizCategories(),
        ]);

        setResults(quizResults || []);

        const categoriesWithColors = (rawCategories || []).map(
          (name: string, index: number) => ({
            id: name || `category-${index}`,
            name,
            description: `Quizzes dans la catégorie ${name}`,
            color: [
              "#4F46E5",
              "#10B981",
              "#F59E0B",
              "#EF4444",
              "#8B5CF6",
              "#EC4899",
            ][index % 6],
            colorClass: [
              "category-blue-500",
              "category-green-500",
              "category-wizi-accent",
              "category-red-500",
              "category-purple-500",
              "category-pink-500",
            ][index % 6],
            quizCount: 0,
          })
        );

        setCategories(categoriesWithColors);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [user]);

  return { results, categories };
};
