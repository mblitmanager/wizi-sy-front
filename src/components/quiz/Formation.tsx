import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mediaService } from '@/services/MediaService';
import formationService from '@/services/FormationService';

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

const GridContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '24px',
  padding: '24px',
});

interface Formation {
  id: string;
  titre: string;
  description: string;
  imageUrl: string;
  duree: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé';
  type: 'Tutoriel' | 'Astuce' | 'Quiz' | 'Exercice';
  progression: number;
}

export const Formation: React.FC = () => {
  const navigate = useNavigate();

  const { data: formations, isLoading: isLoadingFormations } = useQuery({
    queryKey: ['formations'],
    queryFn: () => formationService.getFormations(),
  });

  const { data: tutoriels, isLoading: isLoadingTutoriels } = useQuery({
    queryKey: ['tutoriels'],
    queryFn: () => mediaService.getTutoriels(),
  });

  const { data: astuces, isLoading: isLoadingAstuces } = useQuery({
    queryKey: ['astuces'],
    queryFn: () => mediaService.getAstuces(),
  });

  const handleFormationClick = (formationId: string) => {
    navigate(`/formation/${formationId}`);
  };

  if (isLoadingFormations || isLoadingTutoriels || isLoadingAstuces) {
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
      <GridContainer>
        {formations?.data?.map((formation) => (
          <StyledCard key={formation.id} onClick={() => handleFormationClick(formation.id)}>
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
        ))}
      </GridContainer>
    </Box>
  );
}; 