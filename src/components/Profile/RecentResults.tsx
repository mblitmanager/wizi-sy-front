import React, { useState, useEffect } from 'react';
import { QuizResult } from '@/types/quiz';
import { Check, X } from 'lucide-react';
import { quizService } from '@/services/quizService';

interface RecentResultsProps {
  results: QuizResult[];
  isLoading: boolean;
  showAll?: boolean;
}

export const RecentResults = ({ results, isLoading, showAll = false }: RecentResultsProps) => {
  const displayedResults = showAll ? results : results.slice(0, 5);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!results.length) {
    return <div>No results yet</div>;
  }

  return (
    <div className="space-y-4">
      {displayedResults.map((result) => (
        <div key={result.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold">{result.quizName}</h3>
          <p>Score: {result.score}%</p>
          <p>Date: {new Date(result.completedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};
