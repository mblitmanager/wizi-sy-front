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
import Question from './Question';
import quizService, {
  Question as QuizQuestion,
  MultipleChoiceAnswer,
  OrderingAnswer,
  FillInBlankAnswer,
  WordBankAnswer,
  FlashcardAnswer,
  MatchingAnswer,
} from '@/services/QuizService';

interface Answer {
  questionId: number;
  value: any;
  isCorrect?: boolean;
  points?: number;
}

export const QuizPlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

  const { data: quizDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['quizDetails', id],
    queryFn: () => quizService.getQuizDetails(Number(id)),
    enabled: !!id,
  });

  const { data: quizQuestions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['quizQuestions', id],
    queryFn: () => quizService.getQuizQuestions(Number(id)),
    enabled: !!id,
  });

  const { data: quizHistory } = useQuery({
    queryKey: ['quizHistory'],
    queryFn: () => quizService.getQuizHistory(),
  });

  const { data: quizStats } = useQuery({
    queryKey: ['quizStats', id],
    queryFn: () => quizService.getQuizStatistics(Number(id)),
    enabled: !!id,
  });

  const submitQuizMutation = useMutation({
    mutationFn: (submission: any) => quizService.submitQuiz(submission),
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: 'Quiz soumis avec succès!',
        severity: 'success',
      });
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
    if (quizDetails?.data?.time_limit) {
      setTimeLeft(quizDetails.data.time_limit * 60);
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
    const currentQuestion = quizQuestions?.data[activeStep];
    const isCorrect = checkAnswer(currentQuestion, answer);
    const points = isCorrect ? parseInt(currentQuestion.points) : 0;

    setAnswers((prev) => {
      const existingAnswerIndex = prev.findIndex((a) => a.questionId === currentQuestion.id);
      if (existingAnswerIndex >= 0) {
        const newAnswers = [...prev];
        newAnswers[existingAnswerIndex] = {
          questionId: currentQuestion.id,
          value: answer,
          isCorrect,
          points,
        };
        return newAnswers;
      }
      return [
        ...prev,
        {
          questionId: currentQuestion.id,
          value: answer,
          isCorrect,
          points,
        },
      ];
    });
  };

  const checkAnswer = (question: QuizQuestion, answer: any): boolean => {
    switch (question.type) {
      case 'choix multiples':
      case 'vrai/faux':
        return question.reponses.every((r) => {
          const multipleChoiceAnswer = r as MultipleChoiceAnswer;
          return (multipleChoiceAnswer.is_correct === 1) === answer.includes(r.id);
        });

      case 'remplir le champ vide':
        return Object.entries(answer).every(([key, value]) => {
          const fillInBlankAnswer = question.reponses.find(
            (r) => (r as FillInBlankAnswer).bank_group === key
          ) as FillInBlankAnswer;
          return fillInBlankAnswer?.text === value;
        });

      case 'rearrangement':
        return answer.every((id: number, index: number) => {
          const orderingAnswer = question.reponses.find(
            (r) => r.id === id
          ) as OrderingAnswer;
          return orderingAnswer?.position === index + 1;
        });

      case 'banque de mots':
        return Object.entries(answer).every(([key, value]) => {
          const wordBankAnswer = question.reponses.find(
            (r) => (r as WordBankAnswer).bank_group === key
          ) as WordBankAnswer;
          return wordBankAnswer?.text === value;
        });

      case 'correspondance':
        return Object.entries(answer).every(([key, value]) => {
          const matchingAnswer = question.reponses.find(
            (r) => (r as MatchingAnswer).text === key
          ) as MatchingAnswer;
          return matchingAnswer?.match_pair === value;
        });

      case 'question audio':
        const audioAnswer = question.reponses.find((r) => r.id === answer) as MultipleChoiceAnswer;
        return audioAnswer?.is_correct === 1;

      case 'flashcard':
        const flashcardAnswer = question.reponses[0] as FlashcardAnswer;
        return flashcardAnswer?.flashcard_back === answer;

      default:
        return false;
    }
  };

  const handleNext = () => {
    if (activeStep < (quizQuestions?.data.length || 0) - 1) {
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

  const handleFinish = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const submission = {
      quiz_id: Number(id),
      answers: answers.reduce((acc, answer) => ({
        ...acc,
        [answer.questionId]: answer.value,
      }), {}),
      time_spent: timeSpent,
    };

    submitQuizMutation.mutate(submission);
    setShowResults(true);
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

  if (!quizQuestions?.data) {
    return (
      <Alert severity="error">
        Quiz non trouvé
      </Alert>
    );
  }

  const currentQuestion = quizQuestions.data[activeStep];
  const totalQuestions = quizQuestions.data.length;
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
          {quizQuestions.data.map((question, index) => (
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
              const question = quizQuestions.data.find((q) => q.id === answer.questionId);
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
