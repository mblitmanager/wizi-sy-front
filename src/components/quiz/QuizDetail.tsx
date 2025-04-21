import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizService } from '../../services/QuizService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Loader2, Clock, Award, BookOpen } from 'lucide-react';
import { Layout } from '../layout/Layout';
import { Badge } from '../ui/badge';

export const QuizDetail: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => quizService.getQuizById(Number(quizId)),
    enabled: !!quizId,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !quiz) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-red-500">Une erreur est survenue lors du chargement du quiz.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{quiz.titre}</CardTitle>
            <CardDescription className="text-lg">{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="text-base">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {quiz.niveau}
                </Badge>
                <Badge variant="outline" className="text-base">
                  <Clock className="w-4 h-4 mr-2" />
                  {quiz.duree} minutes
                </Badge>
                <Badge variant="outline" className="text-base">
                  <Award className="w-4 h-4 mr-2" />
                  {quiz.nb_points_total} points
                </Badge>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Questions</h3>
                <div className="grid gap-4">
                  {quiz.questions.map((question, index) => (
                    <div key={question.id} className="p-4 border rounded-lg">
                      <p className="font-medium">Question {index + 1}</p>
                      <p className="text-gray-600">{question.text}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Type: {question.type} • Points: {question.points}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => navigate(`/quiz/${quizId}/start`)}
              className="w-full"
              size="lg"
            >
              Commencer le quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}; 