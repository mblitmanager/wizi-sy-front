import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trophy } from 'lucide-react';
import type { QuizAttempt } from '../../types';

interface RecentQuizzesProps {
  attempts: QuizAttempt[];
}

function RecentQuizzes({ attempts }: RecentQuizzesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Quizzes</h3>
      <div className="space-y-4">
        {attempts.map((attempt) => (
          <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                {attempt.completed ? (
                  <Trophy className="w-5 h-5 text-blue-600" />
                ) : (
                  <Clock className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium">{attempt.quizId}</h4>
                <p className="text-sm text-gray-600">
                  Score: {attempt.score}/{attempt.maxScore}
                </p>
              </div>
            </div>
            <Link
              to={`/quiz/${attempt.quizId}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentQuizzes;