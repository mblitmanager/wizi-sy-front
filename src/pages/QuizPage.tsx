
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz, QuizResult, Question } from '@/types';
import { mockAPI, quizAPI } from '@/api';
import QuizQuestion from '@/components/Quiz/QuizQuestion';
import QuizResultComponent from '@/components/Quiz/QuizResult';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; answerId: string; isCorrect: boolean }[]>([]);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [quizEndTime, setQuizEndTime] = useState<Date | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        
        // In a real app, we would use API calls
        // const quizData = await quizAPI.getQuizById(id);
        const categories = mockAPI.getCategories();
        const allQuizzes: Quiz[] = [];
        
        categories.forEach(category => {
          allQuizzes.push(...mockAPI.getQuizzesByCategory(category.id));
        });
        
        const quizData = allQuizzes.find(q => q.id === id) || null;
        setQuiz(quizData);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le quiz",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const startQuiz = () => {
    setHasStarted(true);
    setQuizStartTime(new Date());
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const handleAnswer = (answerId: string, isCorrect: boolean) => {
    if (!quiz) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    setAnswers(prev => [
      ...prev,
      { questionId: currentQuestion.id, answerId, isCorrect }
    ]);
    
    // Move to the next question or end the quiz
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 1000);
    } else {
      endQuiz();
    }
  };

  const endQuiz = () => {
    if (!quiz || !user || !quizStartTime) return;
    
    const endTime = new Date();
    setQuizEndTime(endTime);
    
    const correctAnswersCount = answers.filter(a => a.isCorrect).length;
    const totalQuestions = quiz.questions.length;
    const score = Math.round((correctAnswersCount / totalQuestions) * quiz.points);
    const timeSpent = Math.floor((endTime.getTime() - quizStartTime.getTime()) / 1000);
    
    const quizResult: QuizResult = {
      id: `result-${Date.now()}`,
      quizId: quiz.id,
      userId: user.id,
      score,
      correctAnswers: correctAnswersCount,
      totalQuestions,
      completedAt: endTime.toISOString(),
      timeSpent,
    };
    
    setResult(quizResult);
    
    // In a real app, we would submit the result to the API
    // quizAPI.submitQuizResult({
    //   quizId: quiz.id,
    //   userId: user.id,
    //   score,
    //   correctAnswers: correctAnswersCount,
    //   totalQuestions,
    //   timeSpent,
    // });
    
    toast({
      title: "Quiz terminé!",
      description: `Vous avez obtenu ${score} points`,
    });
  };

  const retryQuiz = () => {
    setResult(null);
    setHasStarted(false);
    setAnswers([]);
    setCurrentQuestionIndex(0);
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
        <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </div>
    );
  }

  // Show quiz start screen
  if (!hasStarted && !result) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
        
        <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
        <p className="text-gray-600 mb-6">{quiz.description}</p>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex justify-between mb-4">
            <div className="text-left">
              <div className="text-sm text-gray-500">Niveau</div>
              <div className="font-medium">{quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Questions</div>
              <div className="font-medium">{quiz.questions.length}</div>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-left">
              <div className="text-sm text-gray-500">Points à gagner</div>
              <div className="font-medium">{quiz.points}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Temps estimé</div>
              <div className="font-medium">{quiz.questions.length * 30} secondes</div>
            </div>
          </div>
        </div>
        
        <Button onClick={startQuiz} className="px-8 py-6 text-lg">
          Commencer le quiz
        </Button>
      </div>
    );
  }

  // Show quiz result
  if (result) {
    return (
      <div className="py-8">
        <QuizResultComponent result={result} onRetry={retryQuiz} />
      </div>
    );
  }

  // Show current question
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="py-8 px-4">
      <QuizQuestion
        question={currentQuestion}
        totalQuestions={quiz.questions.length}
        currentQuestion={currentQuestionIndex + 1}
        onAnswer={handleAnswer}
        timeLimit={30} // adjust based on difficulty if needed
      />
    </div>
  );
};

export default QuizPage;
