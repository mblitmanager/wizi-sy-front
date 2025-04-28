
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, Tabs, Tab, Box, Typography, Avatar, Button } from '@mui/material';
import { PlayCircle, Book, Video, FileText, Download, Clock, Calendar, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import formationService from '@/services/FormationService';
import { mediaService } from '@/services/MediaService';
import { QuizList } from './QuizList';

interface FormationProps {
  id?: string;
}

export const Formation: React.FC<FormationProps> = ({ id: propId }) => {
  const { formationId } = useParams<{ formationId: string }>();
  const id = propId || formationId;
  const [tabValue, setTabValue] = useState(0);
  const [progress, setProgress] = useState(0);

  const { data: formation, isLoading: isLoadingFormation } = useQuery({
    queryKey: ['formation', id],
    queryFn: () => {
      if (!id) throw new Error('Formation ID is required');
      return formationService.getFormationById(id);
    },
    enabled: !!id,
  });

  const { data: modules, isLoading: isLoadingModules } = useQuery({
    queryKey: ['formation-modules', id],
    queryFn: () => {
      if (!id) throw new Error('Formation ID is required');
      return formationService.getFormationProgress(id);
    },
    enabled: !!id,
  });

  // Query for videos 
  const { data: videos, isLoading: isLoadingVideos } = useQuery({
    queryKey: ['formation-videos', id],
    queryFn: () => {
      if (!id) throw new Error('Formation ID is required');
      return mediaService.getMediasByType('video');
    },
    enabled: !!id,
  });

  // Query for documents
  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['formation-documents', id],
    queryFn: () => {
      if (!id) throw new Error('Formation ID is required');
      return mediaService.getMediasByType('document');
    },
    enabled: !!id,
  });

  useEffect(() => {
    // Simulate progress calculation
    if (formation) {
      const completedModules = modules?.filter(m => m.completed) || [];
      const newProgress = modules?.length ? Math.round((completedModules.length / modules.length) * 100) : 0;
      setProgress(newProgress);
    }
  }, [formation, modules]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (isLoadingFormation) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Chargement de la formation...</Typography>
      </Box>
    );
  }

  if (!formation) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Formation non trouvée.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 2 }}>
      <Card sx={{ mb: 4 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {formation.title ? formation.title.charAt(0) : 'F'}
            </Avatar>
          }
          title={formation.title}
          subheader={`${formation.category} • ${formation.level || 'Tous niveaux'}`}
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Progression: {progress}%
              </Typography>
              <Trophy size={18} />
            </Box>
          }
        />
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">{formation.description}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Clock size={16} style={{ marginRight: '4px' }} />
              <Typography variant="body2">{formation.duration} heures</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Calendar size={16} style={{ marginRight: '4px' }} />
              <Typography variant="body2">Début: {new Date(formation.startDate).toLocaleDateString()}</Typography>
            </Box>
            {formation.endDate && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Calendar size={16} style={{ marginRight: '4px' }} />
                <Typography variant="body2">Fin: {new Date(formation.endDate).toLocaleDateString()}</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<PlayCircle />}
              href={`/formation/${formation.id}/start`}
            >
              Continuer la formation
            </Button>
            <Button 
              variant="outlined"
              startIcon={<Book />}
              href={`/formation/${formation.id}/modules`}
            >
              Voir les modules
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="formation tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Modules" icon={<Book />} iconPosition="start" />
            <Tab label="Quiz" icon={<Trophy />} iconPosition="start" />
            <Tab label="Vidéos" icon={<Video />} iconPosition="start" />
            <Tab label="Documents" icon={<FileText />} iconPosition="start" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {isLoadingModules ? (
            <Typography>Chargement des modules...</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {modules?.map((module) => (
                <Card key={module.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6">{module.title}</Typography>
                        <Typography variant="body2" color="textSecondary">{module.description}</Typography>
                      </Box>
                      <Button 
                        variant="outlined"
                        startIcon={<PlayCircle />}
                        href={`/formation/module/${module.id}`}
                      >
                        {module.completed ? 'Revoir' : 'Commencer'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              {!modules?.length && (
                <Typography>Aucun module disponible.</Typography>
              )}
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mt: 2 }}>
            <QuizList />
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {isLoadingVideos ? (
            <Typography>Chargement des vidéos...</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {videos?.map((video) => (
                <Card key={video.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6">{video.title}</Typography>
                        <Typography variant="body2" color="textSecondary">{video.description}</Typography>
                      </Box>
                      <Button 
                        variant="outlined"
                        startIcon={<Video />}
                        href={video.url}
                        target="_blank"
                      >
                        Voir la vidéo
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              {!videos?.length && (
                <Typography>Aucune vidéo disponible.</Typography>
              )}
            </Box>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          {isLoadingDocuments ? (
            <Typography>Chargement des documents...</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {documents?.map((document) => (
                <Card key={document.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="h6">{document.title}</Typography>
                        <Typography variant="body2" color="textSecondary">{document.description}</Typography>
                      </Box>
                      <Button 
                        variant="outlined"
                        startIcon={<Download />}
                        href={document.url}
                        target="_blank"
                      >
                        Télécharger
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              {!documents?.length && (
                <Typography>Aucun document disponible.</Typography>
              )}
            </Box>
          )}
        </TabPanel>
      </Box>
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
