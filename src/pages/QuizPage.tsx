
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { quizService } from '../services/quizService';
import { Question, QuestionAnswer } from '../types/quiz';
import { Timer } from '@/components/ui/timer';
import QuestionRenderer from '../components/questions/QuestionRenderer';
import { quizAPI } from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

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
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{quiz?.title || 'Quiz'}</CardTitle>
            <Badge variant="outline">{quiz?.level || 'Standard'}</Badge>
          </div>
          <div className="mb-2">
            <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
              <span>Question {currentQuestionIndex + 1} sur {questions.length}</span>
              <span>{timeLeft} secondes</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <QuestionRenderer
            question={currentQuestion}
            onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
            isAnswerChecked={showExplanation}
            selectedAnswer={answers[currentQuestion.id] || null}
            timeRemaining={timeLeft}
          />

          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              Précédent
            </Button>

            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] && !showExplanation}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Terminer' : 'Suivant'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizPage;
