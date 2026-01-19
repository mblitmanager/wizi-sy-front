import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
  Button,
  Box,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  AccessTime as AccessTimeIcon,
  TrendingDown as TrendingDownIcon,
  PersonOff as PersonOffIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  category: string;
  title: string;
  message: string;
  stagiaire_id: number;
  stagiaire_name: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
}

export default function AlertsWidget() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/formateur/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(res.data.alerts || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'inactivity':
      case 'never_connected':
        return <PersonOffIcon />;
      case 'deadline':
        return <AccessTimeIcon />;
      case 'performance':
      case 'dropout':
        return <TrendingDownIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const getColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  if (loading || alerts.length === 0) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Alertes Intelligentes</Typography>
            <Badge badgeContent={alerts.length} color="error" sx={{ ml: 2 }} />
          </Box>
        }
      />
      <CardContent sx={{ p: 0 }}>
        <List>
          {alerts.slice(0, 5).map((alert) => (
            <ListItem
              key={alert.id}
              divider
              secondaryAction={
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate(`/profile/${alert.stagiaire_id}`)}
                >
                  Voir
                </Button>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: `${getColor(alert.priority)}.light`, color: `${getColor(alert.priority)}.main` }}>
                  {getIcon(alert.category)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">{alert.title}</Typography>
                    <Chip
                      label={alert.priority.toUpperCase()}
                      size="small"
                      color={getColor(alert.priority) as any}
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                      {alert.stagiaire_name}
                    </Typography>
                    {' - '}
                    {alert.message}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
