import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Award, Clock } from 'lucide-react';
import type { QuizAttempt } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

function History() {
  const { data: history, isLoading, error } = useQuery({
    queryKey: ['quiz-history'],
    queryFn: async () => {
      // TODO: Implement API call
      return [] as QuizAttempt[];
    }
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Erreur lors du chargement de l'historique" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Historique d'apprentissage</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Jours consécutifs</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Quiz complétés</p>
              <p className="text-2xl font-semibold">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Temps total</p>
              <p className="text-2xl font-semibold">0h</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Activités récentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history && history.length > 0 ? (
                history.map((attempt) => (
                  <tr key={attempt.id}>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(attempt.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">Quiz #{attempt.quizId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {attempt.score}/{attempt.maxScore}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">--:--</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-600" colSpan={4}>
                    Aucune activité récente
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default History;
