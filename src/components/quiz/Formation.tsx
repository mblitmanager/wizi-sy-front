import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent, CardMedia, Button, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

interface Formation {
  id: string;
  titre: string;
  description: string;
  imageUrl: string;
  duree: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé';
  type: 'Vidéo' | 'Article' | 'Quiz' | 'Exercice';
  progression: number;
}

export const Formation: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simuler le chargement des formations
    const fetchFormations = async () => {
      try {
        // TODO: Remplacer par un appel API réel
        const mockFormations: Formation[] = [
          {
            id: '1',
            titre: 'Introduction à la Programmation',
            description: 'Apprenez les bases de la programmation avec des exercices interactifs.',
            imageUrl: '/images/formation1.jpg',
            duree: '2h',
            niveau: 'Débutant',
            type: 'Vidéo',
            progression: 75,
          },
          {
            id: '2',
            titre: 'Développement Web Avancé',
            description: 'Maîtrisez les frameworks modernes et les bonnes pratiques.',
            imageUrl: '/images/formation2.jpg',
            duree: '4h',
            niveau: 'Avancé',
            type: 'Quiz',
            progression: 30,
          },
          // Ajoutez plus de formations ici
        ];
        setFormations(mockFormations);
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const handleFormationClick = (formationId: string) => {
    navigate(`/formation/${formationId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Formations Interactives
      </Typography>
      <Grid container spacing={3}>
        {formations.map((formation) => (
          <Grid item xs={12} sm={6} md={4} key={formation.id}>
            <StyledCard onClick={() => handleFormationClick(formation.id)}>
              <StyledCardMedia
                image={formation.imageUrl}
                title={formation.titre}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {formation.titre}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {formation.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Chip
                    label={formation.niveau}
                    color={
                      formation.niveau === 'Débutant'
                        ? 'primary'
                        : formation.niveau === 'Intermédiaire'
                        ? 'secondary'
                        : 'error'
                    }
                    size="small"
                  />
                  <Typography variant="caption" color="textSecondary">
                    {formation.duree}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={formation.type}
                    variant="outlined"
                    size="small"
                  />
                  <Box display="flex" alignItems="center">
                    <Typography variant="caption" color="textSecondary" mr={1}>
                      Progression:
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {formation.progression}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 