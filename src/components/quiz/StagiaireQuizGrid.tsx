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
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8 text-center">
        <h2 className="text-lg md:text-2xl font-bold text-orange-400 mb-2">
          Quiz à découvrir
        </h2>
        <p className="text-gray-500">Aucun quiz ne correspond à vos filtres</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
      <h2 className="text-lg md:text-2xl font-bold text-orange-400 mb-6">
        Quiz à découvrir
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <Link key={quiz.id} to={`/quiz/${quiz.id}`}>
            <QuizCard quiz={quiz} categories={categories} />
          </Link>
        ))}
      </div>
    </div>
  );
}
