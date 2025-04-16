import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { quizService } from '../services/quizService';
import { Question, QuestionAnswer, Quiz } from '../types/quiz';
import { Timer } from '@/components/ui/timer';
import QuestionRenderer from '../components/questions/QuestionRenderer';
import { quizAPI } from '../api';
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
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

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
    const fetchQuiz = async () => {
      if (!quizId) return;
      setIsLoading(true);
      try {
        console.log('Récupération du quiz:', quizId);
        
        // Fetch quiz details first
        const quizData = await quizAPI.getQuizById(quizId);
        console.log('Quiz récupéré:', quizData);
        setQuiz(quizData);
        
        // Then fetch questions
        console.log('Récupération des questions pour le quiz:', quizId);
        const quizQuestions = await quizAPI.getQuizQuestions(quizId);
        console.log('Questions récupérées:', quizQuestions);
        
        if (!quizQuestions || quizQuestions.length === 0) {
          console.error('Aucune question reçue de l\'API');
          toast.error('Aucune question disponible pour ce quiz');
          return;
        }
        
        // Set the fetched questions
        setQuestions(quizQuestions);
        
        // Set time limit if available in quiz data
        if (quizData.timeLimit) {
          setTimeLeft(quizData.timeLimit);
        }
      } catch (error) {
        console.error('Error fetching quiz and questions:', error);
        toast.error('Failed to load quiz questions');
        
        // Add mock questions for testing purposes
        const mockQuestions: Question[] = [
          {
            id: `q-${quizId}-1`,
            quiz_id: quizId || "",
            text: "Qu'est-ce que le HTML?",
            type: "choix multiples",
            points: 10,
            correct_answer: "0",
            options: ["Hypertext Markup Language", "High Tech Modern Language", "Home Tool Management Library"]
          },
          {
            id: `q-${quizId}-2`,
            quiz_id: quizId || "",
            text: "JavaScript est un langage de programmation orienté objet?",
            type: "vrai faux",
            points: 5,
            correct_answer: "1",
          }
        ];
        setQuestions(mockQuestions);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuiz();
  }, [quizId]);

  const handleAnswer = (questionId: string, answer: QuestionAnswer) => {
    console.log('Réponse sélectionnée:', { questionId, answer });
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = async () => {
    if (!quizId) return;
    setIsSubmitting(true);
    try {
      // Convertir les réponses au format attendu par l'API
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
        if (Array.isArray(answer)) {
          return answer.join(',');
        } else if (typeof answer === 'object') {
          return JSON.stringify(answer);
        }
        return answer.toString();
      });

      console.log('Réponses formatées pour soumission:', formattedAnswers);
      const result = await quizService.submitQuiz(quizId, formattedAnswers);
      navigate(`/quiz/${quizId}/result`, { state: { result } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Aucune question disponible</h2>
              <p className="text-gray-600 mb-4">Ce quiz ne contient pas de questions pour le moment.</p>
              <Button onClick={() => navigate('/quiz')}>Retour aux quiz</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  console.log('Question courante:', currentQuestion);
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="container mx-auto p-4 pb-20 md:pb-4">
      <h1 className="text-3xl font-bold mb-6">Quiz</h1>
      
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="w-full justify-start mb-6">
          <TabsTrigger value="available">Quiz disponibles</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="ranking">Classement</TabsTrigger>
        </TabsList>

        {/* Onglet des quiz disponibles */}
        <TabsContent value="available">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quizLevels.map((level) => (
              <Card key={level.id} className="text-center">
                <CardHeader className="p-4">
                  <div className="mx-auto mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {level.icon}
                  </div>
                  <CardTitle className="text-lg">{level.name}</CardTitle>
                  <CardDescription>{level.questions} questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {level.name === "Super Quiz" 
                      ? "Questions aléatoires sur toutes les thématiques" 
                      : `Questions sur la formation en cours`}
                  </p>
                  <Badge variant="outline" className="mb-2">
                    {level.questions * 2} points possibles
                  </Badge>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">Commencer</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet de l'historique */}
        <TabsContent value="history">
          <div className="space-y-4">
            {quizHistory.map((quiz) => (
              <Card key={quiz.id}>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{quiz.name}</CardTitle>
                      <CardDescription>Complété le {quiz.date}</CardDescription>
                    </div>
                    <Badge 
                      variant={quiz.score >= 80 ? "default" : quiz.score >= 60 ? "secondary" : "destructive"}
                      className="text-lg px-3 py-1"
                    >
                      {quiz.score}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Correctes</p>
                        <p className="text-lg">{quiz.correct}/{quiz.questions}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Incorrectes</p>
                        <p className="text-lg">{quiz.incorrect}/{quiz.questions}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Temps</p>
                        <p className="text-lg">{quiz.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <BarChart className="h-5 w-5 text-purple-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Points</p>
                        <p className="text-lg">{quiz.questions * 2 * (quiz.score / 100)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full">Revoir les réponses</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet du classement */}
        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Classement général
              </CardTitle>
              <CardDescription>
                Basé sur le nombre de quiz joués et les scores réalisés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ranking.map((rank, index) => (
                  <div key={rank.id} className="flex items-center justify-between p-3 rounded bg-muted/50">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        index === 0 ? 'bg-yellow-500 text-white' : 
                        index === 1 ? 'bg-gray-300 text-gray-700' : 
                        index === 2 ? 'bg-amber-600 text-white' : 
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{rank.name}</p>
                        <p className="text-xs text-muted-foreground">{rank.quizzes} quiz joués</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{rank.points} points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/recompenses" className="w-full">
                <Button className="w-full">Voir les récompenses</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizPage;
