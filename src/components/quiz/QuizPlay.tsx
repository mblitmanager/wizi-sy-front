import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Paper,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Timer, HelpCircle, CheckCircle, XCircle, History, BarChart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Question } from './Question';
import quizService from '@/services/QuizService';
import { Quiz as QuizType, Question as QuestionType } from '@/types/quiz';

interface QuizPlayProps {}

interface Answer {
  questionId: string;
  value: any;
  isCorrect?: boolean;
  points?: number;
}

export const QuizPlay: React.FC<QuizPlayProps> = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [currentHint, setCurrentHint] = useState<string>('');
  const [startTime, setStartTime] = useState<number>(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

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
            setSnackbar({
              open: true,
              message: 'Erreur lors de la création de la participation',
              severity: 'error',
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
            setSnackbar({
              open: true,
              message: 'Erreur lors de la création de la participation',
              severity: 'error',
            });
          }
        } else {
          console.error('Error checking participation:', error);
          setSnackbar({
            open: true,
            message: 'Erreur lors de la vérification de la participation',
            severity: 'error',
          });
        }
      }
    };

    checkParticipation();
  }, [quizId, navigate]);

  const { data: quizDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['quizDetails', quizId],
    queryFn: () => {
      if (!quizId) throw new Error('No quiz ID provided');
      return quizService.getQuizDetails(Number(quizId));
    },
    enabled: !!quizId,
  });

  const { data: quizResult, refetch: refetchQuizResult } = useQuery({
    queryKey: ['quizResult', quizId],
    queryFn: () => {
      if (!quizId) throw new Error('No quiz ID provided');
      return quizService.getQuizResult(Number(quizId));
    },
    enabled: false,
  });

  const { data: quizQuestions, isLoading: isLoadingQuestions, error: questionsError } = useQuery({
    queryKey: ['quizQuestions', quizId],
    queryFn: () => {
      if (!quizId) throw new Error('No quiz ID provided');
      return quizService.getQuizQuestions(quizId);
    },
    enabled: !!quizId,
  });

  const { data: quizHistory } = useQuery({
    queryKey: ['quizHistory'],
    queryFn: () => quizService.getQuizHistory(),
  });

  const { data: quizStats } = useQuery({
    queryKey: ['quizStats', quizId],
    queryFn: () => {
      if (!quizId) throw new Error('No quiz ID provided');
      return quizService.getQuizStatistics(Number(quizId));
    },
    enabled: !!quizId,
  });

  const submitQuizMutation = useMutation({
    mutationFn: (submission: any) => quizService.submitQuiz(submission),
    onSuccess: async (data) => {
      setSnackbar({
        open: true,
        message: 'Quiz soumis avec succès!',
        severity: 'success',
      });
      await refetchQuizResult();
      navigate(`/quiz/${quizId}/results`, { state: { result: data.data } });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la soumission du quiz',
        severity: 'error',
      });
    },
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
      refetchQuizResult();
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la soumission du quiz',
        severity: 'error',
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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (questionsError) {
    console.error('Error loading quiz questions:', questionsError);
    return (
      <Alert severity="error">
        Erreur lors du chargement du quiz: {questionsError.message}
      </Alert>
    );
  }

  if (!quizQuestions || quizQuestions.length === 0) {
    console.log('No questions found for quiz:', quizId);
    return (
      <Alert severity="warning">
        Aucune question trouvée pour ce quiz. Veuillez vérifier que le quiz existe et contient des questions.
      </Alert>
    );
  }

  const currentQuestion = quizQuestions[activeStep];
  const totalQuestions = quizQuestions.length;
  const currentAnswer = answers.find((a) => a.questionId === currentQuestion.id);

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">
            {quizDetails?.data?.titre || 'Quiz'}
          </Typography>
          <Box display="flex" gap={2}>
            <IconButton onClick={() => setShowHistory(true)}>
              <History />
            </IconButton>
            <IconButton onClick={() => setShowStats(true)}>
              <BarChart />
            </IconButton>
            {timeLeft !== null && (
              <Box display="flex" alignItems="center" gap={1}>
                <Timer size={20} />
                <Typography variant="h6">
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {quizQuestions.map((question, index) => (
            <Step key={question.id}>
              <StepLabel>
                {answers.find((a) => a.questionId === question.id)?.isCorrect !== undefined && (
                  <Box position="absolute" top={-8} right={-8}>
                    {answers.find((a) => a.questionId === question.id)?.isCorrect ? (
                      <CheckCircle color="success" size={20} />
                    ) : (
                      <XCircle color="error" size={20} />
                    )}
                  </Box>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Question
          question={currentQuestion}
          onAnswer={handleAnswer}
          showFeedback={showResults}
        />

        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button
            startIcon={<ChevronLeft />}
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Précédent
          </Button>
          {currentQuestion.astuce && (
            <IconButton
              onClick={() => {
                setShowHint(true);
                setCurrentHint(currentQuestion.astuce);
              }}
            >
              <HelpCircle />
            </IconButton>
          )}
          {activeStep === totalQuestions - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinish}
              endIcon={<CheckCircle />}
            >
              Terminer
            </Button>
          ) : (
            <Button
              endIcon={<ChevronRight />}
              onClick={handleNext}
              disabled={!currentAnswer}
            >
              Suivant
            </Button>
          )}
        </Box>
      </Paper>

      <Dialog open={showHint} onClose={() => setShowHint(false)}>
        <DialogTitle>Astuce</DialogTitle>
        <DialogContent>
          <Typography>{currentHint}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHint(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showResults} onClose={() => setShowResults(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Résultats du Quiz</DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={3}>
            <Typography variant="h4" gutterBottom>
              Score: {calculateScore()} points
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {answers.filter((a) => a.isCorrect).length} bonnes réponses sur {totalQuestions}
            </Typography>
          </Box>
          <Box mt={2}>
            {answers.map((answer) => {
              const question = quizQuestions.find((q) => q.id === answer.questionId);
              return (
                <Box key={answer.questionId} mb={2}>
                  <Typography variant="subtitle1">{question?.text}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    {answer.isCorrect ? (
                      <CheckCircle color="success" size={20} />
                    ) : (
                      <XCircle color="error" size={20} />
                    )}
                    <Typography variant="body2">
                      {answer.points} points
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/formations')}>Retour aux formations</Button>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Recommencer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showHistory} onClose={() => setShowHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>Historique des Quiz</DialogTitle>
        <DialogContent>
          {quizHistory?.data?.map((result, index) => (
            <Box key={index} mb={2} p={2} border="1px solid" borderColor="divider" borderRadius={1}>
              <Typography variant="h6">Quiz #{result.questions[0]?.quiz_id || 'Inconnu'}</Typography>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography>Score: {result.score}</Typography>
                <Typography>Temps: {formatTime(result.time_spent)}</Typography>
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showStats} onClose={() => setShowStats(false)} maxWidth="md" fullWidth>
        <DialogTitle>Statistiques du Quiz</DialogTitle>
        <DialogContent>
          {quizStats?.data && (
            <Box>
              <Typography variant="h6">Moyenne des scores: {quizStats.data.average_score}</Typography>
              <Typography variant="h6">Temps moyen: {formatTime(quizStats.data.average_time)}</Typography>
              <Typography variant="h6">Taux de réussite: {quizStats.data.success_rate}%</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStats(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};
