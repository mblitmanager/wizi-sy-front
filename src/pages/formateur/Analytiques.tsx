import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Analytiques() {
  const [period, setPeriod] = useState(30);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [successStats, setSuccessStats] = useState([]);
  const [activityByDay, setActivityByDay] = useState([]);
  const [dropoutStats, setDropoutStats] = useState([]);
  const [formations, setFormations] = useState([]);
  const [formationId, setFormationId] = useState('');
  const [formationsPerformance, setFormationsPerformance] = useState([]);
  const [studentsComparison, setStudentsComparison] = useState([]);

  useEffect(() => {
    loadFormations();
  }, []);

  useEffect(() => {
    loadData();
  }, [period, formationId]);

  const loadFormations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/formateur/formations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormations(res.data.formations || []);
    } catch (error) {
      console.error('Error loading formations:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      };
      const fQuery = formationId ? `&formation_id=${formationId}` : '';

      const [summaryRes, successRes, activityRes, dropoutRes, performanceRes, comparisonRes] = await Promise.all([
        axios.get(`${API_URL}/formateur/analytics/dashboard?period=${period}${fQuery}`, { headers }),
        axios.get(`${API_URL}/formateur/analytics/quiz-success-rate?period=${period}${fQuery}`, { headers }),
        axios.get(`${API_URL}/formateur/analytics/activity-heatmap?period=${period}${fQuery}`, { headers }),
        axios.get(`${API_URL}/formateur/analytics/dropout-rate?${fQuery}`, { headers }),
        axios.get(`${API_URL}/formateur/analytics/formations-performance`, { headers }),
        axios.get(`${API_URL}/formateur/analytics/students-comparison?${fQuery}`, { headers }),
      ]);

      setSummary(summaryRes.data.summary);
      setSuccessStats(successRes.data.quiz_stats || []);
      setActivityByDay(activityRes.data.activity_by_day || []);
      setDropoutStats(dropoutRes.data.quiz_dropout || []);
      setFormationsPerformance(performanceRes.data || []);
      setStudentsComparison(comparisonRes.data || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Analytiques & Rapports
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip label="30j" color={period === 30 ? 'primary' : 'default'} onClick={() => setPeriod(30)} />
          <Chip label="60j" color={period === 60 ? 'primary' : 'default'} onClick={() => setPeriod(60)} />
          <Chip label="90j" color={period === 90 ? 'primary' : 'default'} onClick={() => setPeriod(90)} />
        </Box>

        <Box sx={{ minWidth: 250 }}>
          <select 
            value={formationId} 
            onChange={(e) => setFormationId(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              backgroundColor: '#fff',
              fontSize: '1rem'
            }}
          >
            <option value="">Toutes les formations</option>
            {formations.map((f: any) => (
              <option key={f.id} value={f.id}>{f.titre}</option>
            ))}
          </select>
        </Box>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="Vue d'ensemble" />
            <Tab label="Formations" />
            <Tab label="Taux de réussite" />
            <Tab label="Activité" />
            <Tab label="Stagiaires" />
          </Tabs>

          {/* Tab 1: Overview */}
          {tabValue === 0 && summary && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PeopleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h4">{summary.total_stagiaires}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Stagiaires
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PeopleIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="h4">{summary.active_stagiaires}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Actifs
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CheckCircleIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h4">{summary.total_completions}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Complétés
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <StarIcon sx={{ color: '#FFD700', mr: 1 }} />
                      <Typography variant="h4">{summary.average_score.toFixed(1)}%</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Score Moyen
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {summary.trend_percentage >= 0 ? (
                        <TrendingUpIcon sx={{ fontSize: 48, color: 'success.main', mr: 2 }} />
                      ) : (
                        <TrendingDownIcon sx={{ fontSize: 48, color: 'error.main', mr: 2 }} />
                      )}
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Tendance
                        </Typography>
                        <Typography variant="h3" sx={{ color: summary.trend_percentage >= 0 ? 'success.main' : 'error.main' }}>
                          {summary.trend_percentage >= 0 ? '+' : ''}
                          {summary.trend_percentage.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          vs période précédente
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Tab 2: Formations Performance */}
          {tabValue === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>PERFORMANCE DES FORMATIONS</Typography>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={formationsPerformance} layout="vertical" margin={{ left: 50 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="nom" type="category" width={100} />
                        <Tooltip />
                        <Bar name="Taux complétion (%)" dataKey="completion_rate" fill="#F7931E" />
                        <Bar name="Score moyen (%)" dataKey="average_score" fill="#ffc107" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                 <Card>
                    <CardContent>
                       <Typography variant="h6" gutterBottom>RÉPARTITION STAGIAIRES</Typography>
                       <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={formationsPerformance}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="nom" />
                             <YAxis />
                             <Tooltip />
                             <Bar name="Nombre de stagiaires" dataKey="total_stagiaires" fill="#4caf50" />
                          </BarChart>
                       </ResponsiveContainer>
                    </CardContent>
                 </Card>
              </Grid>
            </Grid>
          )}

          {/* Tab 3: Success Rates */}
          {tabValue === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  TAUX DE RÉUSSITE PAR QUIZ
                </Typography>
                <List>
                  {successStats.map((stat) => (
                    <ListItem key={stat.quiz_id}>
                      <ListItemText
                        primary={stat.quiz_name}
                        secondary={`${stat.category} • ${stat.successful_attempts}/${stat.total_attempts} tentatives`}
                      />
                      <Box sx={{ width: '200px', mr: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={stat.success_rate}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: stat.success_rate >= 70 ? 'success.main' : stat.success_rate >= 50 ? 'warning.main' : 'error.main',
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 60 }}>
                        {stat.success_rate.toFixed(1)}%
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Tab 4: Activity */}
          {tabValue === 3 && (
            <>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    ACTIVITÉ PAR JOUR
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activityByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="activity_count" fill="#F7931E" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    TAUX D'ABANDON (Top 5)
                  </Typography>
                  <List>
                    {dropoutStats.slice(0, 5).map((dropout, idx) => (
                      <ListItem key={idx}>
                        <ListItemText
                          primary={dropout.quiz_name}
                          secondary={`${dropout.abandoned}/${dropout.total_attempts} abandonnés`}
                        />
                        <Chip
                          label={`${dropout.dropout_rate.toFixed(1)}%`}
                          color={dropout.dropout_rate > 50 ? 'error' : 'warning'}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </>
          )}

          {/* Tab 5: Students Comparison */}
          {tabValue === 4 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>COMPARAISON DES STAGIAIRES</Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Stagiaire</th>
                        <th style={{ padding: '12px' }}>Points</th>
                        <th style={{ padding: '12px' }}>Quiz Complétés</th>
                        <th style={{ padding: '12px' }}>Taux de Complétion</th>
                        <th style={{ padding: '12px' }}>Score Moyen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsComparison.map((s: any) => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                          <td style={{ padding: '12px' }}>
                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {s.image ? (
                                   <img src={s.image} alt={s.name} style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 8 }} />
                                ) : (
                                   <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
                                      {s.name?.charAt(0)}
                                   </Box>
                                )}
                                {s.name}
                             </Box>
                          </td>
                          <td style={{ padding: '12px' }}>{s.total_points}</td>
                          <td style={{ padding: '12px' }}>{s.completed_quizzes}/{s.total_quizzes}</td>
                          <td style={{ padding: '12px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={s.completion_rate} 
                                sx={{ width: 60, mr: 1, height: 6, borderRadius: 3 }}
                              />
                              {s.completion_rate}%
                            </Box>
                          </td>
                          <td style={{ padding: '12px' }}>{s.avg_score}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}
