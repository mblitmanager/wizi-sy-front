import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Avatar, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { quizSubmissionService } from '../../services/quiz/QuizSubmissionService';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

interface ClassementEntry {
  id: string;
  stagiaire: {
    id: string;
    nom: string;
    prenom: string;
  };
  quiz: {
    id: string;
    titre: string;
  };
  points: number;
  rang: number;
}

interface GlobalClassementEntry {
  stagiaire_id: string;
  stagiaire_nom: string;
  stagiaire_prenom: string;
  total_points: number;
  quiz_count: number;
  moyenne: number;
}

export const Profil: React.FC = () => {
  const [classement, setClassement] = useState<ClassementEntry[]>([]);
  const [globalClassement, setGlobalClassement] = useState<GlobalClassementEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassement = async () => {
      try {
        setLoading(true);
        const data = await quizSubmissionService.getGlobalClassement();
        setGlobalClassement(data);
      } catch (err) {
        setError('Erreur lors du chargement du classement');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassement();
  }, []);

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
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{ width: 100, height: 100, margin: '0 auto 20px' }}
              alt="Profil"
              src="/images/avatar.jpg"
            />
            <Typography variant="h5" gutterBottom>
              Mon Profil
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Bienvenue dans votre espace personnel
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
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
                    <StyledTableRow key={entry.stagiaire_id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{entry.stagiaire_nom}</TableCell>
                      <TableCell>{entry.stagiaire_prenom}</TableCell>
                      <TableCell align="right">{entry.total_points}</TableCell>
                      <TableCell align="right">{entry.quiz_count}</TableCell>
                      <TableCell align="right">{entry.moyenne.toFixed(2)}</TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 