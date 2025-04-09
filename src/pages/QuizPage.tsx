
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { quizAPI } from '@/api';
import { mockAPI } from '@/api/mockAPI';
import { Quiz, Question, QuizResult } from '@/types';
import { useAuth } from '@/context/AuthContext';
import QuizQuestion from '@/components/Quiz/QuizQuestion';
import QuizResultComponent from '@/components/Quiz/QuizResult';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger le quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        if (!id) return;
        
        let foundQuiz: Quiz;
        try {
          // Essayer d'abord d'utiliser l'API
          foundQuiz = await quizAPI.getQuizById(id);
          const quizQuestions = await quizAPI.getQuizQuestions(id);
          setQuestions(quizQuestions);
        } catch (error) {
          console.error('Échec de récupération du quiz via API:', error);
          // Utiliser les données factices en cas d'échec
          const allQuizzes = mockAPI.getAllQuizzes();
          foundQuiz = allQuizzes.find(q => q.id === id) as Quiz;
          if (foundQuiz) {
            setQuestions(foundQuiz.questions);
          }
        }
        
        if (foundQuiz) {
          setQuiz(foundQuiz);
          setStartTime(new Date());
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de trouver ce quiz",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Échec de récupération du quiz:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger ce quiz",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [id, toast]);

  // Gérer les réponses aux questions
  const handleAnswer = (answerId: string, isCorrect: boolean) => {
    if (!quiz || questions.length === 0) return;
    
    const question = questions[currentQuestionIndex];
    
    // Mettre à jour les réponses de l'utilisateur
    setUserAnswers(prev => ({
      ...prev,
      [question.id]: answerId
    }));
    
    // Mettre à jour les réponses correctes
    if (isCorrect) {
      setCorrectAnswers(prev => [...prev, question.id]);
    }
    
    // Passer à la question suivante ou finir le quiz
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      } else {
        finishQuiz();
      }
    }, 1000);
  };

  // Finaliser le quiz
  const finishQuiz = () => {
    if (!quiz || !user || !startTime || questions.length === 0) return;
    
    const endTime = new Date();
    const timeSpentSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Calculer le score
    const score = Math.round((correctAnswers.length / questions.length) * 100);
    
    // Créer le résultat du quiz
    const quizResult: QuizResult = {
      id: `result_${Date.now()}`,
      quizId: quiz.id,
      userId: user.id,
      score,
      correctAnswers: correctAnswers.length,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
      timeSpent: timeSpentSeconds
    };
    
    setResult(quizResult);
    setIsFinished(true);
    
    // Envoyer le résultat à l'API si disponible
    try {
      quizAPI.submitQuizResult(quizResult)
        .then(() => {
          toast({
            title: "Succès",
            description: "Votre résultat a été enregistré",
          });
        })
        .catch(error => {
          console.error('Échec de soumission du résultat:', error);
          toast({
            title: "Avertissement",
            description: "Impossible d'enregistrer votre résultat en ligne",
            variant: "destructive"
          });
        });
    } catch (error) {
      console.error('Erreur lors de la soumission du résultat:', error);
    }
  };

  // Redémarrer le quiz
  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setCorrectAnswers([]);
    setIsFinished(false);
    setResult(null);
    setStartTime(new Date());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!quiz) {
    return <Navigate to="/quiz" />;
  }

  // Afficher le résultat du quiz si terminé
  if (isFinished && result) {
    return <QuizResultComponent result={result} onRetry={handleRetryQuiz} />;
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto pb-20 md:pb-0 md:pl-64">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Aucune question trouvée pour ce quiz</h2>
          <Link to="/quiz" className="mt-4 inline-block">
            <Button>Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-0 md:pl-64">
      <div className="mb-6">
        <Link to={`/category/${quiz.categoryId}`} className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4 font-nunito">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Retour
        </Link>
        
        <h1 className="text-2xl font-bold mb-2 font-montserrat">{quiz.title}</h1>
        <p className="text-gray-600 font-roboto">{quiz.description}</p>
      </div>

      {currentQuestion && (
        <QuizQuestion
          question={currentQuestion}
          totalQuestions={questions.length}
          currentQuestion={currentQuestionIndex + 1}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
};

export default QuizPage;
