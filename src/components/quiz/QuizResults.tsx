import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { quizSubmissionService } from '../../services/quiz/QuizSubmissionService';
import QuizService from '@/services/QuizService';
import { QuizSummary } from './QuizSummary';

interface QuizResult {
  id: string;
  quizId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
  timeSpent: number;
}

interface ClassementEntry {
  id: string;
  stagiaire: {
    id: string;
    nom: string;
    prenom: string;
  };
  points: number;
  rang: number;
}

interface GlobalClassementEntry {
  stagiaire_id: string;
  nom: string;
  prenom: string;
  total_points: number;
  quiz_count: number;
  moyenne: number;
}

export const QuizResults: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState<QuizResult | null>(location.state?.result || null);
  const [quizClassement, setQuizClassement] = useState<ClassementEntry[]>([]);
  const [globalClassement, setGlobalClassement] = useState<GlobalClassementEntry[]>([]);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        if (quizId) {
          // Si nous n'avons pas de résultat dans l'état de la navigation, on le récupère
          if (!result) {
            const quizResult = await quizSubmissionService.getQuizResult(quizId);
            setResult(quizResult);
          }
          
          // Récupérer le classement du quiz
          const classementData = await quizSubmissionService.getClassement(quizId);
          setQuizClassement(classementData);

          // Récupérer le classement global
          const globalData = await quizSubmissionService.getGlobalClassement();
          setGlobalClassement(globalData);
        }
      } catch (err) {
        setError('Erreur lors du chargement des résultats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId, result]);

  const handleRestartQuiz = () => {
    if (quizId) {
      navigate(`/quiz/${quizId}`);
    }
  };

  const handleShowSummary = async () => {
    if (!result?.id) return;
    setLoadingSummary(true);
    try {
      const data = await QuizService.getInstance().getParticipationResume(Number(result.id));
      setSummaryData(data);
      setShowSummary(true);
    } catch (e) {
      setError('Erreur lors du chargement du résumé');
    } finally {
      setLoadingSummary(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Résultats du quiz */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Résultats du Quiz
          </Typography>
          {result && (
            <Box>
              <Typography variant="h6">
                Score: {result.score}%
              </Typography>
              <Typography>
                Réponses correctes: {result.correctAnswers}/{result.totalQuestions}
              </Typography>
              <Typography>
                Temps passé: {Math.floor(result.timeSpent / 60)} minutes {result.timeSpent % 60} secondes
              </Typography>
            </Box>
          )}
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Classement du quiz */}
          <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              Classement du Quiz
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rang</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell align="right">Points</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quizClassement.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.rang}</TableCell>
                      <TableCell>{entry.stagiaire.nom}</TableCell>
                      <TableCell>{entry.stagiaire.prenom}</TableCell>
                      <TableCell align="right">{entry.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Classement global */}
          <Paper elevation={3} sx={{ p: 3, flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              Classement Global
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Rang</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell align="right">Total Points</TableCell>
                    <TableCell align="right">Quiz Completés</TableCell>
                    <TableCell align="right">Moyenne</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {globalClassement.map((entry, index) => (
                    <TableRow key={entry.stagiaire_id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{entry.nom}</TableCell>
                      <TableCell>{entry.prenom}</TableCell>
                      <TableCell align="right">{entry.total_points}</TableCell>
                      <TableCell align="right">{entry.quiz_count}</TableCell>
                      <TableCell align="right">{entry.moyenne.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* Bouton pour consulter le résumé */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleShowSummary}
            disabled={loadingSummary}
          >
            {loadingSummary ? 'Chargement...' : 'Consulter le résumé'}
          </Button>
        </Box>
        {/* Bouton pour recommencer */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRestartQuiz}
            size="large"
          >
            Recommencer le Quiz
          </Button>
        </Box>
        {/* Modale de résumé */}
        {showSummary && summaryData && (
          <Dialog open={showSummary} onClose={() => setShowSummary(false)} maxWidth="md" fullWidth>
            <DialogTitle>Résumé du Quiz</DialogTitle>
            <DialogContent>
              <QuizSummary
                quiz={summaryData.quiz}
                questions={summaryData.questions}
                userAnswers={Object.fromEntries(summaryData.questions.map((q: any) => [q.question_id, q.userAnswers]))}
                score={summaryData.score}
                totalQuestions={summaryData.totalQuestions}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowSummary(false)}>Fermer</Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
}; 