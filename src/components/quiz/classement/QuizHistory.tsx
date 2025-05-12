
import { QuizHistory as QuizHistoryType } from '@/types/quiz';
import { format } from 'date-fns';
import { Loader2, Trophy, Clock3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface QuizHistoryProps {
  history: QuizHistoryType[];
  loading?: boolean;
}

export const QuizHistory = ({ history, loading = false }: QuizHistoryProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement de l'historique...</span>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Vous n'avez pas encore complété de quiz.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Mon historique de quiz</h3>
      
      {history.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium">
                  {item.quiz?.title || 'Quiz sans titre'}
                </h4>
                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-3 mt-1">
                  <span>{item.quiz?.category || 'Catégorie non spécifiée'}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock3 className="h-3.5 w-3.5 mr-1" />
                    {Math.floor(item.timeSpent / 60)}:{(item.timeSpent % 60).toString().padStart(2, '0')}
                  </span>
                  <span>•</span>
                  <span>
                    {format(new Date(item.completedAt), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">
                  {item.score} points
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
