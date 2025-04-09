
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Quiz, Question, QuizResult } from '@/types';
import { quizAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import QuizQuestion from '@/components/Quiz/QuizQuestion';
import QuizResultComponent from '@/components/Quiz/QuizResult';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  // Fetch quiz data using React Query
  const { data: quiz, isLoading: isQuizLoading, error: quizError } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => id ? quizAPI.getQuizById(id) : Promise.reject('No quiz ID provided'),
    enabled: !!id,
  });

  // Fetch quiz questions using React Query
  const { data: questions, isLoading: areQuestionsLoading, error: questionsError } = useQuery({
    queryKey: ['quizQuestions', id],
    queryFn: () => id ? quizAPI.getQuizQuestions(id) : Promise.reject('No quiz ID provided'),
    enabled: !!id,
  });

  // Handle errors
  useEffect(() => {
    if (quizError) {
      console.error('Error fetching quiz:', quizError);
      toast({
        title: "Erreur",
        description: "Impossible de charger le quiz",
        variant: "destructive",
      });
    }
    
    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      toast({
        title: "Erreur",
        description: "Impossible de charger les questions du quiz",
        variant: "destructive",
      });
    }
  }, [quizError, questionsError, toast]);

  const startQuiz = () => {
    setIsQuizStarted(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCorrectAnswers(0);
    setIsQuizCompleted(false);
    setResult(null);
    setStartTime(Date.now());
  };

  const handleAnswer = (answerId: string, isCorrect: boolean) => {
    if (!questions) return;
    
    const questionId = questions[currentQuestionIndex].id;
    
    // Enregistrement de la réponse
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
    
    // Mise à jour du compteur de réponses correctes
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Passage à la question suivante ou fin du quiz
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 500);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    if (!quiz || !questions) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      // Préparer les données du résultat
      const quizResultData = {
        quizId: quiz.id,
        userId: user?.id || 'anonymous',
        score: Math.round((correctAnswers / questions.length) * quiz.points),
        correctAnswers,
        totalQuestions: questions.length,
        timeSpent,
      };
      
      // Soumettre le résultat à l'API
      const submittedResult = await quizAPI.submitQuizResult(quizResultData);
      
      // Mettre à jour l'état avec le résultat
      setResult({
        ...submittedResult,
        // Ajouter des champs qui pourraient manquer dans la réponse de l'API
        completedAt: submittedResult.completedAt || new Date().toISOString(),
        id: submittedResult.id || `result_${Date.now()}`,
      });
      
      setIsQuizCompleted(true);
      
      toast({
        title: "Quiz terminé",
        description: `Vous avez obtenu ${quizResultData.score} points!`,
      });
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre résultat",
        variant: "destructive",
      });
      
      // Même en cas d'erreur, on affiche le résultat à l'utilisateur
      const fallbackResult: QuizResult = {
        id: `result_${Date.now()}`,
        quizId: quiz.id,
        userId: user?.id || 'anonymous',
        score: Math.round((correctAnswers / questions.length) * quiz.points),
        correctAnswers,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString(),
        timeSpent,
      };
      
      setResult(fallbackResult);
      setIsQuizCompleted(true);
    }
  };

  const isLoading = isQuizLoading || areQuestionsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quiz || !questions) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-montserrat">Quiz non trouvé</h2>
        <p className="text-gray-600 mb-8 font-roboto">Le quiz que vous recherchez n'existe pas.</p>
        <Link to="/">
          <Button className="font-nunito">Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  if (isQuizCompleted && result) {
    return (
      <div className="pb-20 md:pb-0 md:pl-64">
        <QuizResultComponent result={result} onRetry={startQuiz} />
      </div>
    );
  }

  if (!isQuizStarted) {
    return (
      <div className="pb-20 md:pb-0 md:pl-64">
        <Link to={`/category/${quiz.category.charAt(0)}`} className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4 font-nunito">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour
        </Link>
        
        <Card className="max-w-xl mx-auto">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-2 font-montserrat">{quiz.title}</h1>
            <p className="text-gray-600 mb-6 font-roboto">{quiz.description}</p>
            
            <div className="mb-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm font-roboto">
                  <div>
                    <span className="text-gray-500">Niveau:</span>
                    <span className="font-semibold ml-1">{quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Points:</span>
                    <span className="font-semibold ml-1">{quiz.points}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Questions:</span>
                    <span className="font-semibold ml-1">{questions.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Temps estimé:</span>
                    <span className="font-semibold ml-1">{questions.length * 30} secondes</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button onClick={startQuiz} size="lg" className="font-nunito">
                Commencer le quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          {questions.length > 0 && currentQuestionIndex < questions.length && (
            <QuizQuestion
              question={questions[currentQuestionIndex]}
              totalQuestions={questions.length}
              currentQuestion={currentQuestionIndex + 1}
              onAnswer={handleAnswer}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;
