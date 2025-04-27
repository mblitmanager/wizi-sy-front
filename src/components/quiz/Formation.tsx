import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Chip, CircularProgress, Tooltip, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mediaService } from '@/services/MediaService';
import formationService from '@/services/FormationService';
import { Trophy, Clock, BookOpen, Star, ChevronRight, Play, Lock, Video } from 'lucide-react';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  animation: 'fadeIn 0.5s ease-in',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}));

const StyledCardMedia = styled(CardMedia)({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))',
  },
});

const ProgressBar = styled('div')<{ progress: number }>(({ progress, theme }) => ({
  width: '100%',
  height: '4px',
  backgroundColor: theme.palette.grey[200],
  borderRadius: '2px',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    display: 'block',
    width: `${progress}%`,
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    transition: 'width 0.3s ease',
  },
}));

const GridContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '24px',
  padding: '24px',
  animation: 'fadeIn 0.5s ease-in',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
});

const LevelBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 10,
    top: 10,
    padding: '0 4px',
  },
}));

interface Media {
  id: number;
  titre: string;
  description: string;
  url: string;
  type: 'video' | 'image' | 'document';
  categorie: 'tutoriel' | 'astuce' | 'quiz';
  duree: string | null;
  ordre: number;
  formation_id: number;
  created_at: string;
  updated_at: string;
}

interface Formation {
  id: string;
  titre: string;
  description: string;
  imageUrl: string;
  duree: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé';
  type: 'Tutoriel' | 'Astuce' | 'Quiz' | 'Exercice';
  progression: number;
  isLocked?: boolean;
  medias?: Media[];
}

const getLevelColor = (niveau: string) => {
  switch (niveau) {
    case 'Débutant':
      return 'success';
    case 'Intermédiaire':
      return 'warning';
    case 'Avancé':
      return 'error';
    default:
      return 'default';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Tutoriel':
      return <BookOpen size={16} />;
    case 'Astuce':
      return <Star size={16} />;
    case 'Quiz':
      return <Trophy size={16} />;
    case 'Exercice':
      return <Play size={16} />;
    default:
      return null;
  }
};

const MediaPreview = styled('div')({
  height: 200,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))',
  },
});

const MediaIcon = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1,
  color: 'white',
  fontSize: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'rgba(0, 0, 0, 0.5)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.7)',
    transform: 'translate(-50%, -50%) scale(1.1)',
  },
}));

export const Formation: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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

  const renderMediaPreview = (media: Media) => {
    if (media.type === 'video') {
      return (
        <MediaPreview>
          <MediaIcon>
            <Video size={32} />
          </MediaIcon>
          <CardMedia
            component="img"
            image={media.url}
            alt={media.titre}
            sx={{ height: '100%', objectFit: 'cover' }}
          />
        </MediaPreview>
      );
    }
    return (
      <CardMedia
        component="img"
        image={media.url}
        alt={media.titre}
        sx={{ height: 200, objectFit: 'cover' }}
      />
    );
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
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Formations Interactives
      </Typography>
      <GridContainer>
        {formations?.data?.map((formation) => (
          <div
            key={formation.id}
            onMouseEnter={() => setHoveredCard(formation.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              transform: hoveredCard === formation.id ? 'scale(1.02)' : 'scale(1)',
              transition: 'transform 0.3s ease',
            }}
          >
            <LevelBadge
              badgeContent={formation.niveau}
              color={getLevelColor(formation.niveau)}
            >
              <StyledCard onClick={() => handleFormationClick(formation.id)}>
                {formation.medias && formation.medias.length > 0 ? (
                  renderMediaPreview(formation.medias[0])
                ) : (
                  <StyledCardMedia
                    image={formation.imageUrl}
                    title={formation.titre}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {formation.titre}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {formation.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Tooltip title={`Niveau ${formation.niveau}`}>
                      <Chip
                        icon={getTypeIcon(formation.type)}
                        label={formation.type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Tooltip>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Clock size={16} />
                      <Typography variant="caption" color="textSecondary">
                        {formation.duree}
                      </Typography>
                    </Box>
                  </Box>
                  {formation.medias && formation.medias.length > 0 && (
                    <Box mb={2}>
                      <Typography variant="caption" color="textSecondary" display="block" mb={1}>
                        Contenu disponible
                      </Typography>
                      <Box display="flex" gap={1}>
                        {formation.medias.map((media) => (
                          <Chip
                            key={media.id}
                            icon={media.type === 'video' ? <Video size={16} /> : <BookOpen size={16} />}
                            label={media.categorie}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                  <Box mb={2}>
                    <Typography variant="caption" color="textSecondary" display="block" mb={1}>
                      Progression
                    </Typography>
                    <ProgressBar progress={formation.progression} />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<ChevronRight />}
                    fullWidth
                    disabled={formation.isLocked}
                    sx={{
                      mt: 'auto',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    {formation.isLocked ? 'Formation verrouillée' : 'Commencer'}
                  </Button>
                </CardContent>
              </StyledCard>
            </LevelBadge>
          </div>
        ))}
      </GridContainer>
    </Box>
  );
}; 