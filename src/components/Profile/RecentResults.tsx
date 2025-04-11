
import React from 'react';
import { QuizResult } from '@/types';
import { mockAPI } from '@/api/mockAPI';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface RecentResultsProps {
  results: QuizResult[];
}

const RecentResults: React.FC<RecentResultsProps> = ({ results }) => {
  if (!results.length) return null;

  // Function to format the date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date);
  };

  return (
    <Collapsible className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold font-montserrat">Résultats récents</h2>
        <CollapsibleTrigger className="rounded-full p-1 hover:bg-gray-100">
          {({ open }: { open: boolean }) => (
            open ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />
          )}
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="space-y-3">
          {results.map((result) => {
            const quiz = mockAPI.getAllQuizzes().find(q => q.id === result.quizId);
            if (!quiz) return null;
            
            return (
              <div key={result.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between mb-2">
                  <h3 className="font-medium font-montserrat">{quiz.title}</h3>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 font-nunito">
                    {result.score}%
                  </Badge>
                </div>
                <div className="text-sm text-gray-500 mb-2 font-roboto">
                  {result.correctAnswers} / {result.totalQuestions} correctes • Complété le {formatDate(result.completedAt)}
                </div>
                <Progress value={result.score} className="h-2" />
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RecentResults;
