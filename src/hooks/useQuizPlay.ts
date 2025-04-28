
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from './use-toast';
import quizService from '@/services/QuizService';

export function useQuizPlay(quizId: string | undefined) {
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

  // Queries
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

  // Initialize quiz participation
  useEffect(() => {
    if (!quizId) {
      console.error('No quiz ID provided');
      navigate('/quizzes');
      return;
    }

    // Check if a participation is in progress
    const checkParticipation = async () => {
      try {
        const participation = await quizService.getCurrentParticipation(quizId);
        if (participation.data) {
          setStartTime(new Date(participation.data.created_at).getTime());
        } else {
          // Start a new participation
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
          // If no participation exists, create a new one
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

  // Initialize timer
  useEffect(() => {
    if (quizDetails?.data?.duree) {
      setTimeLeft(quizDetails.data.duree * 60);
      setStartTime(Date.now());
    }
  }, [quizDetails]);

  // Timer logic
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

  // Answer handling functions
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

  // Navigation functions
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
      // Mark participation as completed
      await quizService.completeParticipation(quizId, {
        score,
        correct_answers: correctAnswers,
        time_spent: timeSpent
      });

      // Submit answers
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

  // UI control functions
  const toggleHint = () => setShowHint(prev => !prev);
  const toggleHistory = () => setShowHistory(prev => !prev);
  const toggleStats = () => setShowStats(prev => !prev);
  const closeResults = () => setShowResults(false);
  const handleRestart = () => window.location.reload();

  return {
    // State
    activeStep,
    quizDetails,
    quizQuestions,
    quizHistory,
    quizStats,
    answers,
    showResults,
    timeLeft,
    showHint,
    showHistory,
    showStats,
    
    // Loading states
    isLoading: isLoadingDetails || isLoadingQuestions,
    error: questionsError,
    
    // Functions
    handleAnswer,
    handleNext,
    handleBack,
    handleFinish,
    calculateScore,
    toggleHint,
    toggleHistory,
    toggleStats,
    closeResults,
    handleRestart
  };
}
