import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { quizService } from '../services/quizService';
import { Question, Reponse, QuizResult, Quiz } from '../types/quiz';
import { Timer } from '@/components/ui/timer';
import QuestionRenderer from '../components/questions/QuestionRenderer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Zap, 
  History, 
  Trophy, 
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  BarChart
} from "lucide-react";

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Données fictives pour les quiz
  const [quizLevels] = useState([
    { id: 1, name: "Débutant", questions: 5, icon: <BookOpen className="h-5 w-5" /> },
    { id: 2, name: "Intermédiaire", questions: 10, icon: <BookOpen className="h-5 w-5" /> },
    { id: 3, name: "Avancé", questions: 15, icon: <BookOpen className="h-5 w-5" /> },
    { id: 4, name: "Super Quiz", questions: 20, icon: <Zap className="h-5 w-5" /> },
  ]);

  // Données fictives pour l'historique des quiz
  const [quizHistory] = useState([
    { 
      id: 1, 
      name: "Quiz Word - Débutant", 
      date: "15/04/2024", 
      score: 80, 
      questions: 5,
      correct: 4,
      incorrect: 1,
      time: "2:30"
    },
    { 
      id: 2, 
      name: "Quiz Excel - Intermédiaire", 
      date: "10/04/2024", 
      score: 60, 
      questions: 10,
      correct: 6,
      incorrect: 4,
      time: "5:15"
    },
    { 
      id: 3, 
      name: "Quiz Photoshop - Débutant", 
      date: "05/04/2024", 
      score: 100, 
      questions: 5,
      correct: 5,
      incorrect: 0,
      time: "1:45"
    },
  ]);

  // Données fictives pour le classement
  const [ranking] = useState([
    { id: 1, name: "Stagiaire 1", points: 950, quizzes: 12 },
    { id: 2, name: "Stagiaire 2", points: 900, quizzes: 10 },
    { id: 3, name: "Stagiaire 3", points: 850, quizzes: 9 },
    { id: 4, name: "Stagiaire 4", points: 800, quizzes: 8 },
    { id: 5, name: "Stagiaire 5", points: 750, quizzes: 7 },
  ]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        if (!quizId) return;
        
        const quizData = await quizService.getQuizById(Number(quizId));
        const questionsData = await quizService.getQuizQuestions(Number(quizId));
        
        // Convertir nb_points_total en number si nécessaire
        const formattedQuizData = {
          ...quizData,
          nb_points_total: Number(quizData.nb_points_total)
        };
        
        setQuiz(formattedQuizData);
        setQuestions(questionsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz:', error);
        setError('Erreur lors du chargement du quiz');
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!quizId) return;
      
      const results = await quizService.getQuizResults(Number(quizId));
      setResults(results);
      // Calculer le score
      const correctAnswers = Object.entries(answers).filter(([questionId, answerId]) => {
        const question = questions.find(q => q.id === questionId);
        return question?.reponses.find(r => r.id === answerId)?.is_correct;
      }).length;
      
      const totalScore = (correctAnswers / questions.length) * 100;
      setScore(totalScore);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  if (!quiz || !questions.length) {
    return <div className="flex items-center justify-center min-h-screen">Aucune donnée de quiz disponible</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{quiz.titre}</h1>
        <p className="text-muted-foreground mb-4">{quiz.description}</p>
        <div className="flex items-center gap-4 mb-4">
          <Badge variant="outline">{quiz.niveau}</Badge>
          <Badge variant="outline">{quiz.nb_points_total} points</Badge>
        </div>
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
          <span>{Math.round(progress)}% complété</span>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <QuestionRenderer
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswerSelect={handleAnswerSelect}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Précédent
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
};

export default QuizPage;
