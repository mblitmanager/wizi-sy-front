
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Quiz, Question, QuizResult } from '@/types';
import { mockAPI } from '@/api';
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
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        
        // Get quiz information
        const quizData = mockAPI.getQuizById(id);
        if (quizData) {
          setQuiz(quizData);
          
          // Get questions for this quiz
          const quizQuestions = mockAPI.getQuestionsByQuizId(id);
          setQuestions(quizQuestions);
        }
      } catch (error) {
        console.error('Failed to fetch quiz data:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le quiz. Veuillez réessayer.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizData();
  }, [id, toast]);

  const handleAnswer = (questionId: string, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    // Calculate result
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswerId) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 70; // Pass threshold
    
    const quizResult: QuizResult = {
      quizId: id || '',
      score,
      totalQuestions: questions.length,
      correctAnswers,
      date: new Date().toISOString(),
      passed
    };
    
    setResult(quizResult);
    setIsQuizCompleted(true);
    
    // Award experience points if passed
    if (passed && user) {
      const newExp = user.experience + quiz?.expPoints || 0;
      updateUser({
        ...user,
        experience: newExp,
        completedQuizzes: [...(user.completedQuizzes || []), id as string]
      });
      
      toast({
        title: "Quiz terminé !",
        description: `Vous avez gagné ${quiz?.expPoints} points d'expérience`,
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsQuizCompleted(false);
    setResult(null);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quiz non trouvé</h2>
        <p className="text-gray-600 mb-8">Le quiz que vous recherchez n'existe pas.</p>
        <Link to="/quiz">
          <Button>Voir tous les quiz</Button>
        </Link>
      </div>
    );
  }

  if (isQuizCompleted && result) {
    return (
      <div className="pb-20 md:pb-0 md:pl-64">
        <Link to={`/category/${quiz.categoryId}`} className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour à la catégorie
        </Link>
        
        <QuizResultComponent result={result} onRestart={handleRestartQuiz} />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswerId = answers[currentQuestion?.id];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="pb-20 md:pb-0 md:pl-64">
      <Link to={`/category/${quiz.categoryId}`} className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Retour à la catégorie
      </Link>
      
      <div className={`h-2 w-24 mb-4 rounded-full bg-${quiz.category?.color || 'blue'}-500`}></div>
      
      <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
      <p className="text-gray-600 mb-8">{quiz.description}</p>
      
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Question {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {quiz.timeLimit} minutes
            </span>
          </div>
          
          {currentQuestion && (
            <QuizQuestion 
              question={currentQuestion} 
              selectedAnswerId={selectedAnswerId}
              onSelectAnswer={(answerId) => handleAnswer(currentQuestion.id, answerId)}
            />
          )}
          
          <div className="flex justify-end mt-8">
            <Button 
              onClick={handleNextQuestion}
              disabled={!selectedAnswerId}
            >
              {isLastQuestion ? "Terminer" : "Question suivante"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;
