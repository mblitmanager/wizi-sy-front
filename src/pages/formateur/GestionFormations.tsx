import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  IconButton,
  Chip,
  LinearProgress,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  VideoLibrary as VideoIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function GestionFormations() {
  const [formations, setFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [unassignedStagiaires, setUnassignedStagiaires] = useState([]);
  const [selectedStagiaires, setSelectedStagiaires] = useState([]);
  const [formationStagiaires, setFormationStagiaires] = useState([]);
  const [formationStats, setFormationStats] = useState(null);

  useEffect(() => {
    loadFormations();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setFilteredFormations(
        formations.filter(
          (f) =>
            f.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.categorie.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredFormations(formations);
    }
  }, [searchQuery, formations]);

  const loadFormations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/formateur/formations/available`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormations(res.data.formations || []);
      setFilteredFormations(res.data.formations || []);
    } catch (error) {
      console.error('Error loading formations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = async (formation) => {
    setSelectedFormation(formation);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${API_URL}/formateur/stagiaires/unassigned/${formation.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnassignedStagiaires(res.data.stagiaires || []);
      setAssignDialogOpen(true);
    } catch (error) {
      console.error('Error loading unassigned:', error);
    }
  };

  const handleAssign = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/formateur/formations/${selectedFormation.id}/assign`,
        { stagiaire_ids: selectedStagiaires },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignDialogOpen(false);
      setSelectedStagiaires([]);
      loadFormations();
    } catch (error) {
      console.error('Error assigning:', error);
    }
  };

  const handleViewDetails = async (formation) => {
    setSelectedFormation(formation);
    try {
      const token = localStorage.getItem('token');
      const [stagRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/formateur/formations/${formation.id}/stagiaires`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/formateur/formations/${formation.id}/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setFormationStagiaires(stagRes.data.stagiaires || []);
      setFormationStats(statsRes.data.stats || null);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error loading details:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des Formations
      </Typography>

      <TextField
        fullWidth
        placeholder="Rechercher une formation..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {filteredFormations.map((formation) => (
            <Grid item xs={12} md={6} key={formation.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {formation.titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formation.categorie}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                    <Chip
                      icon={<PersonIcon />}
                      label={`${formation.nb_stagiaires} stagiaires`}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      icon={<VideoIcon />}
                      label={`${formation.nb_videos} vidéos`}
                      size="small"
                    />
                    <Chip
                      icon={<ScheduleIcon />}
                      label={`${formation.duree_estimee}h`}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleViewDetails(formation)}
                    >
                      Détails
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAssignClick(formation)}
                    >
                      Assigner
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assigner: {selectedFormation?.titre}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            Sélectionnez les stagiaires:
          </Typography>
          {unassignedStagiaires.map((stagiaire) => (
            <FormControlLabel
              key={stagiaire.id}
              control={
                <Checkbox
                  checked={selectedStagiaires.includes(stagiaire.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedStagiaires([...selectedStagiaires, stagiaire.id]);
                    } else {
                      setSelectedStagiaires(selectedStagiaires.filter((id) => id !== stagiaire.id));
                    }
                  }}
                />
              }
              label={`${stagiaire.prenom} ${stagiaire.nom} (${stagiaire.email})`}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleAssign} variant="contained" disabled={selectedStagiaires.length === 0}>
            Assigner
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedFormation?.titre}</DialogTitle>
        <DialogContent>
          {formationStats && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={3}>
                <Card sx={{ bgcolor: 'primary.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4">{formationStats.total_stagiaires}</Typography>
                    <Typography variant="body2">Total</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ bgcolor: 'success.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4">{formationStats.completed}</Typography>
                    <Typography variant="body2">Complété</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4">{formationStats.in_progress}</Typography>
                    <Typography variant="body2">En cours</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={3}>
                <Card sx={{ bgcolor: 'grey.400', color: 'white' }}>
                  <CardContent>
                    <Typography variant="h4">{formationStats.not_started}</Typography>
                    <Typography variant="body2">Pas démarré</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          <Typography variant="h6" gutterBottom>
            Stagiaires inscrits:
          </Typography>
          {formationStagiaires.map((stagiaire) => (
            <Card key={stagiaire.id} sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1">
                  {stagiaire.prenom} {stagiaire.nom}
                </Typography>
                <LinearProgress variant="determinate" value={stagiaire.progress} sx={{ mt: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {stagiaire.progress}% complété
                </Typography>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
