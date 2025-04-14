
import React, { useState, useEffect } from 'react';
import { QuizResult } from '@/types';
import { Check, X } from 'lucide-react';
import { quizAPI } from '@/api';

const RecentResults: React.FC = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, we would call an API endpoint to get the results
        // For now, we'll use placeholder data
        const mockResults: QuizResult[] = [
          {
            id: '1',
            quizId: 'quiz1',
            userId: 'user1',
            score: 80,
            correctAnswers: 8,
            totalQuestions: 10,
            completedAt: new Date().toISOString(),
            timeSpent: 245,
            quizName: 'Quiz de bases HTML'
          },
          {
            id: '2',
            quizId: 'quiz2',
            userId: 'user1',
            score: 75,
            correctAnswers: 6,
            totalQuestions: 8,
            completedAt: new Date(Date.now() - 86400000).toISOString(),
            timeSpent: 180,
            quizName: 'Quiz CSS Avancé'
          }
        ];
        
        setResults(mockResults);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Format date: "12 avril 2023 à 15:30"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace('à', 'à');
  };

  // Format time: "3m 25s"
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return <div className="text-center p-6">Chargement des résultats...</div>;
  }

  if (results.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Vous n'avez pas encore complété de quiz.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div key={result.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{result.quizName}</h3>
            <span className={`text-sm font-medium ${result.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
              {result.score}%
            </span>
          </div>
          
          <div className="flex justify-between text-sm text-gray-500 mb-3">
            <span>{formatDate(result.completedAt)}</span>
            <span>{formatTime(result.timeSpent)}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <div className="flex items-center mr-4">
              <Check className="h-4 w-4 text-green-500 mr-1" />
              <span>{result.correctAnswers} correctes</span>
            </div>
            <div className="flex items-center">
              <X className="h-4 w-4 text-red-500 mr-1" />
              <span>{result.totalQuestions - result.correctAnswers} incorrectes</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentResults;
