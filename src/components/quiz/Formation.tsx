import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  Collapse,
} from '@mui/material';
import { FolderOpen, PlayCircle, Download } from 'lucide-react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import FormationService from '@/services/FormationService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FormationProps {}

export const Formation: React.FC<FormationProps> = () => {
  const { formationId } = useParams<{ formationId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const { data: formation, isLoading, error } = useQuery({
    queryKey: ['formation', formationId],
    queryFn: () => {
      if (!formationId) throw new Error('Formation ID is required');
      return FormationService.getFormationById(formationId);
    },
    enabled: !!formationId && isAuthenticated,
    meta: {
      onError: (error: any) => {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les détails de la formation.',
          variant: 'destructive'
        });
        console.error('Error loading formation details:', error);
      }
    }
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Chargement des détails de la formation...</Typography>
      </Box>
    );
  }

  if (error || !formation) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Formation non disponible</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/formations')}
          startIcon={<FolderOpen />}
        >
          Retour aux formations
        </Button>
      </Box>
    );
  }

  const handleQuizStart = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleToggleCollapse = (mediaId: string) => {
    setOpen(prevState => ({
      ...prevState,
      [mediaId]: !prevState[mediaId],
    }));
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: 2 }}>
      <Card sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          height="240"
          image={formation.image || "https://source.unsplash.com/random"}
          alt={formation.name}
        />
        <CardContent>
          <Typography variant="h4" component="div" sx={{ mb: 2 }}>
            {formation.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {formation.description}
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Quizzes:</Typography>
            <List>
              {formation.quizzes.map((quiz) => (
                <ListItem 
                  key={quiz.id} 
                  button 
                  onClick={() => handleQuizStart(quiz.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <ListItemIcon>
                    <PlayCircle />
                  </ListItemIcon>
                  <ListItemText primary={quiz.title} />
                </ListItem>
              ))}
            </List>
          </Box>
        </CardContent>
      </Card>

      {formation.medias && formation.medias.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Médias</Typography>
          <Grid container spacing={2}>
            {formation.medias.map((media) => (
              <Grid item xs={12} sm={6} md={4} key={media.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" className="mb-1">
                      {media.titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {media.description}
                    </Typography>
                    <Button size="small" href={media.url} target="_blank" rel="noopener noreferrer">
                      Voir le média
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {formation.fichiers && formation.fichiers.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Téléchargements
            <IconButton
              aria-label="expand"
              size="small"
              onClick={() => handleToggleCollapse('downloads')}
            >
              {open['downloads'] ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Typography>
          <Collapse in={!!open['downloads']} timeout="auto" unmountOnExit>
            <TableContainer component={Paper}>
              <Table aria-label="downloads table">
                <TableBody>
                  {formation.fichiers.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell component="th" scope="row">
                        {file.titre}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          href={file.url}
                          download
                        >
                          Télécharger
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </Box>
      )}
    </Box>
  );
};
