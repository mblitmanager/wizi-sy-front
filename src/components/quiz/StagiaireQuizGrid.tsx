import { StagiaireQuizCard } from "./StagiaireQuizCard";
import type { Quiz, Category } from "@/types/quiz";
import { Link } from "react-router-dom";
import React from "react";
import { QuizCard } from "./QuizCard";

interface StagiaireQuizGridProps {
  quizzes: Quiz[];
  categories: Category[] | undefined;
}

export function StagiaireQuizGrid({
  quizzes,
  categories,
}: StagiaireQuizGridProps) {
  if (!quizzes || !quizzes.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucun quiz ne correspond à vos filtres</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <Link key={quiz.id} to={`/quiz/${quiz.id}`}>
          <QuizCard quiz={quiz} categories={categories} />
        </Link>
      ))}
    </div>
  );
}
