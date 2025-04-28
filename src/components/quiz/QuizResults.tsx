import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { CheckCircle, XCircle, Clock, Trophy, BarChart, FileText, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import quizService from '@/services/QuizService';

export const QuizResults = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (location.state?.result) {
      setResult(location.state.result);
    }
  }, [location.state]);

  const { data: fetchedResult, isLoading } = useQuery({
    queryKey: ['quiz-result', quizId],
    queryFn: () => {
      if (!quizId) throw new Error('Quiz ID is required');
      return quizService.getQuizResult(Number(quizId));
    },
    enabled: !!quizId && !result,
    onSuccess: (data) => {
      if (!result) {
        setResult(data.data);
      }
    },
  });

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading || !result) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  const score = result.score;
  const totalQuestions = result.total_questions;
  const correctAnswers = result.correct_answers;
  const timeSpent = result.time_spent;
  const questions = result.questions || [];

  const scorePercentage = Math.round((score / (totalQuestions * 10)) * 100);
  
  const isPassing = scorePercentage >= 70;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => navigate('/quizzes')}
          variant="outlined"
        >
          Retour aux quiz
        </Button>
        <Button
          startIcon={<BarChart />}
          onClick={() => navigate(`/quiz/${quizId}/statistics`)}
          variant="outlined"
        >
          Statistiques
        </Button>
      </Box>

      <Card variant="outlined" sx={{ mb: 4, overflow: 'hidden' }}>
        <Box
          sx={{
            p: 3,
            bgcolor: isPassing ? 'success.light' : 'warning.light',
            color: isPassing ? 'success.contrastText' : 'warning.contrastText',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            {isPassing ? 'Félicitations !' : 'Vous pouvez faire mieux !'}
          </Typography>
          <Typography variant="body1">
            {isPassing
              ? 'Vous avez réussi ce quiz avec succès.'
              : 'Continuez à vous entraîner pour améliorer votre score.'}
          </Typography>
        </Box>

        <CardContent>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-around"
            alignItems="center"
            py={3}
          >
            <Box textAlign="center" mb={{ xs: 2, sm: 0 }}>
              <Typography variant="h3" color="primary">
                {score} / {totalQuestions * 10}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Points
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Box textAlign="center" mb={{ xs: 2, sm: 0 }}>
              <Typography variant="h3" color="primary">
                {correctAnswers} / {totalQuestions}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Réponses correctes
              </Typography>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Box textAlign="center">
              <Typography variant="h3" color="primary">
                {formatTime(timeSpent)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Temps
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Résumé des réponses
      </Typography>

      <List sx={{ mb: 4 }}>
        {questions.map((question: any) => (
          <ListItem
            key={question.id}
            sx={{
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              bgcolor: question.is_correct ? 'success.light' : 'error.light',
              color: question.is_correct ? 'success.contrastText' : 'error.contrastText',
            }}
          >
            <ListItemIcon>
              {question.is_correct ? (
                <CheckCircle color="success" />
              ) : (
                <XCircle color="error" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={question.text}
              secondary={
                !question.is_correct && question.explication ? (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Explication: {question.explication}
                  </Typography>
                ) : null
              }
            />
          </ListItem>
        ))}
      </List>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button variant="outlined" onClick={() => navigate('/quizzes')}>
          Retour aux quiz
        </Button>
        <Button
          variant="contained"
          startIcon={<Trophy />}
          color="primary"
          onClick={() => navigate(`/quiz/${quizId}/retry`)}
        >
          Réessayer
        </Button>
      </Box>
    </Container>
  );
};
