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

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [summaryRes, successRes, activityRes, dropoutRes] = await Promise.all([
        axios.get(`${API_URL}/formateur/analytics/dashboard?period=${period}`, { headers }),
        axios.get(`${API_URL}/formateur/analytics/quiz-success-rate?period=${period}`, { headers }),
        axios.get(`${API_URL}/formateur/analytics/activity-heatmap?period=${period}`, { headers }),
        axios.get(`${API_URL}/formateur/analytics/dropout-rate`, { headers }),
      ]);

      setSummary(summaryRes.data.summary);
      setSuccessStats(successRes.data.quiz_stats || []);
      setActivityByDay(activityRes.data.activity_by_day || []);
      setDropoutStats(dropoutRes.data.quiz_dropout || []);
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

      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Chip label="30j" color={period === 30 ? 'primary' : 'default'} onClick={() => setPeriod(30)} />
        <Chip label="60j" color={period === 60 ? 'primary' : 'default'} onClick={() => setPeriod(60)} />
        <Chip label="90j" color={period === 90 ? 'primary' : 'default'} onClick={() => setPeriod(90)} />
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 3 }}>
            <Tab label="Vue d'ensemble" />
            <Tab label="Taux de réussite" />
            <Tab label="Activité" />
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

          {/* Tab 2: Success Rates */}
          {tabValue === 1 && (
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

          {/* Tab 3: Activity */}
          {tabValue === 2 && (
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
        </>
      )}
    </Container>
  );
}
