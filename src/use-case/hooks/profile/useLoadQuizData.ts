import { useEffect, useState } from "react";
import { quizService } from "@/services/quizServiceA";
import { QuizResult, Category } from "@/types/quiz";

export const useLoadQuizData = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchQuizData = async () => {
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
            "category-yellow-500",
            "category-red-500",
            "category-purple-500",
            "category-pink-500",
          ][index % 6],
          quizCount: 0,
        })
      );

      setCategories(categoriesWithColors);
    };

    fetchQuizData();
  }, []);
   console.log("QuizResultBBBs:", results);
      console.log("CategorieBBBs:", categories);
  return { results, categories };
};
