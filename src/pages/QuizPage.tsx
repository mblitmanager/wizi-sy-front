
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Quiz, Question, QuizResult } from '@/types';
import { mockAPI } from '@/api/mockAPI';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import QuizQuestion from '@/components/Quiz/QuizQuestion';
import QuizResultComponent from '@/components/Quiz/QuizResult';
import { useToast } from '@/hooks/use-toast';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        
        // Dans une vraie application, nous utiliserions des appels API
        const categories = mockAPI.getCategories();
        const categoryId = id.charAt(0);
        const categoryQuizzes = mockAPI.getQuizzesByCategory(categoryId);
        const foundQuiz = categoryQuizzes.find(q => q.id === id) || null;
        
        if (foundQuiz) {
          setQuiz(foundQuiz);
          setQuestions(foundQuiz.questions);
        }
      } catch (error) {
        console.error('Échec de récupération des données du quiz:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le quiz",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [id, toast]);

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

  const completeQuiz = () => {
    if (!quiz) return;
    
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    // Dans une application réelle, nous soumettrions le résultat à l'API
    const quizResult = {
      id: `result_${Date.now()}`,
      quizId: quiz.id,
      userId: user?.id || 'anonymous',
      score: Math.round((correctAnswers / questions.length) * quiz.points),
      correctAnswers,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
      timeSpent,
    };
    
    setResult(quizResult);
    setIsQuizCompleted(true);
    
    toast({
      title: "Quiz terminé",
      description: `Vous avez obtenu ${quizResult.score} points!`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quiz) {
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
                    <span className="font-semibold ml-1">{quiz.questions.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Temps estimé:</span>
                    <span className="font-semibold ml-1">{quiz.questions.length * 30} secondes</span>
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
