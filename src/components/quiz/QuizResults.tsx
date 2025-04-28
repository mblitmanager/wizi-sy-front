
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, Button, Box, Typography, Divider, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Check, X, Award, Clock, BarChart2, ChevronRight, Home } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import QuizService from '@/services/QuizService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface QuizResultProps {}

export const QuizResults: React.FC<QuizResultProps> = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { data: result, isLoading } = useQuery({
    queryKey: ['quiz-result', quizId],
    queryFn: () => {
      if (!quizId) throw new Error('Quiz ID is required');
      return QuizService.getQuizResult(Number(quizId));
    },
    enabled: !!quizId && isAuthenticated,
    meta: {
      onError: (error: any) => {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les résultats du quiz.',
          variant: 'destructive'
        });
        console.error('Error loading quiz results:', error);
      }
    }
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Chargement des résultats...</Typography>
      </Box>
    );
  }

  if (!result || !result.data) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Résultats non disponibles</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/quizzes')}
          startIcon={<Home />}
        >
          Retour aux quizzes
        </Button>
      </Box>
    );
  }

  const quizResult = result.data;
  const percentageScore = Math.round((quizResult.score / quizResult.total_questions) * 100);
  const isPassing = percentageScore >= 70;

  // Format time
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
      <Card sx={{ mb: 4 }}>
        <CardHeader 
          title="Résultats du Quiz"
          subheader={`Vous avez complété ce quiz le ${new Date().toLocaleDateString()}`}
        />
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: '4rem',
                color: isPassing ? 'success.main' : 'error.main',
                mb: 1
              }}
            >
              {percentageScore}%
            </Typography>
            <Typography variant="h6">
              {quizResult.correct_answers} sur {quizResult.total_questions} réponses correctes
            </Typography>
            <Box sx={{ mt: 2, mb: 2 }}>
              <Chip 
                icon={isPassing ? <Check /> : <X />} 
                label={isPassing ? "Réussi" : "À revoir"} 
                color={isPassing ? "success" : "error"} 
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <List>
            <ListItem>
              <ListItemText 
                primary="Score total" 
                secondary={`${quizResult.score} points`} 
                primaryTypographyProps={{
                  sx: { display: 'flex', alignItems: 'center' }
                }}
                secondaryTypographyProps={{
                  sx: { fontWeight: 'bold' }
                }}
                sx={{ display: 'flex' }}
              />
              <Award />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Temps utilisé" 
                secondary={formatTime(quizResult.time_spent)} 
                primaryTypographyProps={{
                  sx: { display: 'flex', alignItems: 'center' }
                }}
                secondaryTypographyProps={{
                  sx: { fontWeight: 'bold' }
                }}
              />
              <Clock />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Performance" 
                secondary={`${isPassing ? 'Excellente' : 'À améliorer'}`} 
                primaryTypographyProps={{
                  sx: { display: 'flex', alignItems: 'center' }
                }}
                secondaryTypographyProps={{
                  sx: { fontWeight: 'bold', color: isPassing ? 'success.main' : 'error.main' }
                }}
              />
              <BarChart2 />
            </ListItem>
          </List>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button 
              variant="outlined"
              onClick={() => navigate('/quizzes')}
              startIcon={<Home />}
            >
              Retour aux quizzes
            </Button>
            <Button 
              variant="contained"
              onClick={() => navigate(`/quiz/${quizId}/review`)}
              endIcon={<ChevronRight />}
            >
              Revoir les questions
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
