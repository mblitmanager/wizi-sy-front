import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question } from './Question';
import { useQuery } from '@tanstack/react-query';
import { Timer, HelpCircle, History, BarChart } from 'lucide-react';
import quizService from '@/services/QuizService';
import { LoadingState } from './quiz-play/LoadingState';
import { ErrorState } from './quiz-play/ErrorState';
import { QuizNavigation } from './quiz-play/QuizNavigation';
import { QuizHistoryDialog } from './quiz-play/QuizHistoryDialog';
import { QuizStatsDialog } from './quiz-play/QuizStatsDialog';
import { QuizResultsDialog } from './quiz-play/QuizResultsDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function QuizPlay() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    if (!quizId) {
      console.error('No quiz ID provided');
      navigate('/quizzes');
      return;
    }

    // Vérifier si une participation est en cours
    const checkParticipation = async () => {
      try {
        const participation = await quizService.getCurrentParticipation(quizId);
        if (participation.data) {
          setStartTime(new Date(participation.data.created_at).getTime());
        } else {
          // Démarrer une nouvelle participation
          const newParticipation = await quizService.startQuizParticipation(Number(quizId));
          if (newParticipation.data) {
            setStartTime(new Date(newParticipation.data.created_at).getTime());
          } else {
            toast({
              title: 'Erreur',
              description: 'Erreur lors de la création de la participation',
              variant: 'destructive',
            });
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Si aucune participation n'existe, en créer une nouvelle
          try {
            const newParticipation = await quizService.startQuizParticipation(Number(quizId));
            if (newParticipation.data) {
              setStartTime(new Date(newParticipation.data.created_at).getTime());
            }
          } catch (startError) {
            console.error('Error starting quiz participation:', startError);
            toast({
              title: 'Erreur',
              description: 'Erreur lors de la création de la participation',
              variant: 'destructive',
            });
          }
        } else {
          console.error('Error checking participation:', error);
          toast({
            title: 'Erreur',
            description: 'Erreur lors de la vérification de la participation',
            variant: 'destructive',
          });
        }
      }
    };

    checkParticipation();
  }, [quizId, navigate, toast]);

  const { data: quizDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['quizDetails', quizId],
    queryFn: () => quizService.getQuizDetails(Number(quizId)),
    enabled: !!quizId,
  });

  const { data: quizQuestions, isLoading: isLoadingQuestions, error: questionsError } = useQuery({
    queryKey: ['quizQuestions', quizId],
    queryFn: () => quizService.getQuizQuestions(quizId!),
    enabled: !!quizId,
  });

  const { data: quizHistory } = useQuery({
    queryKey: ['quizHistory'],
    queryFn: () => quizService.getQuizHistory(),
  });

  const { data: quizStats } = useQuery({
    queryKey: ['quizStats', quizId],
    queryFn: () => quizService.getQuizStatistics(Number(quizId)),
    enabled: !!quizId,
  });

  useEffect(() => {
    if (quizDetails?.data?.duree) {
      setTimeLeft(quizDetails.data.duree * 60);
      setStartTime(Date.now());
    }
  }, [quizDetails]);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(timer);
          handleFinish();
          return 0;
        }
        return prev! - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (answer: any) => {
    const currentQuestion = quizQuestions?.[activeStep];
    const isCorrect = checkAnswer(currentQuestion, answer);
    const points = isCorrect ? parseInt(currentQuestion?.points?.toString() || '0') : 0;

    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex((a) => a.questionId === currentQuestion?.id);
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = {
          questionId: currentQuestion?.id || '',
          value: answer,
          isCorrect,
          points,
        };
        return newAnswers;
      }
      return [
        ...prev,
        {
          questionId: currentQuestion?.id || '',
          value: answer,
          isCorrect,
          points,
        },
      ];
    });
  };

  const checkAnswer = (question: any, answer: any): boolean => {
    switch (question.type) {
      case 'choix multiples':
        return question.reponses.every((r: any) => 
          (r.is_correct === 1) === answer.includes(r.id)
        );
      case 'vrai/faux':
        return question.reponses[0].is_correct === 1 && answer === question.reponses[0].id;
      case 'remplir le champ vide':
        return Object.entries(answer).every(([key, value]) => 
          question.reponses.find((r: any) => r.bank_group === key)?.text === value
        );
      case 'rearrangement':
        return answer.every((id: number, index: number) => 
          question.reponses.find((r: any) => r.id === id)?.position === index + 1
        );
      case 'banque de mots':
        return Object.entries(answer).every(([key, value]) => 
          question.reponses.find((r: any) => r.bank_group === key)?.text === value
        );
      case 'correspondance':
        return Object.entries(answer).every(([key, value]) => 
          question.reponses.find((r: any) => r.text === key)?.match_pair === value
        );
      case 'question audio':
        return question.reponses.find((r: any) => r.id === answer)?.is_correct === 1;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (activeStep < (quizQuestions?.length || 0) - 1) {
      setActiveStep((prev) => prev + 1);
      setShowHint(false);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
      setShowHint(false);
    }
  };

  const handleFinish = async () => {
    if (!quizId) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const score = calculateScore();
    const correctAnswers = answers.filter(answer => answer.isCorrect).length;

    try {
      // Marquer la participation comme terminée
      await quizService.completeParticipation(quizId, {
        score,
        correct_answers: correctAnswers,
        time_spent: timeSpent
      });

      // Soumettre les réponses
      await quizService.submitQuiz({
        quiz_id: Number(quizId),
        answers: answers.reduce((acc, answer) => {
          acc[Number(answer.questionId)] = answer.value;
          return acc;
        }, {} as Record<number, any>),
        time_spent: timeSpent
      });

      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la soumission du quiz',
        variant: 'destructive',
      });
    }
  };

  const calculateScore = () => {
    return answers.reduce((total, answer) => total + (answer.points || 0), 0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoadingDetails || isLoadingQuestions) {
    return <LoadingState />;
  }

  if (questionsError || !quizQuestions || quizQuestions.length === 0) {
    return <ErrorState />;
  }

  const currentQuestion = quizQuestions[activeStep];
  const totalQuestions = quizQuestions.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <span className="font-mono">
            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHint(true)}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHistory(true)}
          >
            <History className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowStats(true)}
          >
            <BarChart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Question
        question={currentQuestion}
        onAnswer={(answer) => handleAnswer(answer)}
        showFeedback={showResults}
      />

      <QuizNavigation
        activeStep={activeStep}
        totalSteps={totalQuestions}
        onBack={handleBack}
        onNext={handleNext}
        onFinish={handleFinish}
      />

      <QuizHistoryDialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        history={quizHistory?.data || []}
      />

      <QuizStatsDialog
        open={showStats}
        onClose={() => setShowStats(false)}
        stats={quizStats?.data}
      />

      <QuizResultsDialog
        open={showResults}
        onClose={() => setShowResults(false)}
        score={calculateScore()}
        totalQuestions={totalQuestions}
        answers={answers}
        questions={quizQuestions}
        onRestart={() => window.location.reload()}
      />
    </div>
  );
}
