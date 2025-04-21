import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { quizService } from '@/services/quizService';
import { Quiz, Question, QuizResult } from '@/types/quiz';
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
  BarChart,
  Loader2
} from "lucide-react";
import { api } from '@/services/api';
import { Formation } from '@/types/formation';

export const QuizPage: React.FC = () => {
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
  const [result, setResult] = useState<QuizResult | null>(null);

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
      if (!quizId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Utiliser la route /api/stagiaire/formations pour récupérer les formations avec leurs quiz
        const response = await api.get<{ data: Formation[] }>('/stagiaire/formations');
        const formations = response.data.data;
        
        // Trouver la formation qui contient le quiz recherché
        const formation = formations.find(f => 
          f.quizzes && f.quizzes.some(q => q.id.toString() === quizId)
        );
        
        if (!formation) {
          setError('Quiz non trouvé');
          return;
        }
        
        // Trouver le quiz spécifique
        const quiz = formation.quizzes.find(q => q.id.toString() === quizId);
        
        if (!quiz) {
          setError('Quiz non trouvé');
          return;
        }
        
        setQuiz(quiz);
        setQuestions(quiz.questions || []);
      } catch (err) {
        setError('Erreur lors du chargement du quiz');
        console.error('Error fetching quiz:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quizId) return;

    try {
      setLoading(true);
      const quizResult = await quizService.submitQuiz(quizId, answers);
      setResult(quizResult);
    } catch (err) {
      setError('Erreur lors de la soumission du quiz');
      console.error('Error submitting quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate('/quiz')}>Retour aux quiz</Button>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Aucun quiz disponible</p>
        <Button onClick={() => navigate('/quiz')}>Retour aux quiz</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{quiz.titre}</h1>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-500 mt-2">
            Question {currentQuestionIndex + 1} sur {questions.length}
          </p>
        </div>

        {result ? (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Résultats</h2>
            <p className="text-lg mb-4">
              Score: {result.score}%
            </p>
            <Button onClick={() => navigate('/quiz')}>Retour aux quiz</Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">{currentQuestion.text}</h2>
              <div className="space-y-4">
                {currentQuestion.reponses.map((option) => (
                  <Button
                    key={option.id}
                    variant={answers[currentQuestion.id] === option.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleAnswer(currentQuestion.id, option.id)}
                  >
                    {option.text}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Précédent
              </Button>
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length !== questions.length}
                >
                  Terminer
                </Button>
              ) : (
                <Button onClick={handleNext}>Suivant</Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default QuizPage;
