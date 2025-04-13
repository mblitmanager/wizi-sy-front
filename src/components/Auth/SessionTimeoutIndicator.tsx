import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const SESSION_TIMEOUT = 15 * 60; // 15 minutes en secondes
const WARNING_TIME = 5 * 60; // 5 minutes en secondes

export const SessionTimeoutIndicator: React.FC = () => {
  const { refreshSession } = useAuth();
  const [timeLeft, setTimeLeft] = useState(SESSION_TIMEOUT);
  const [showWarning, setShowWarning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      setTimeLeft(SESSION_TIMEOUT);
      setShowWarning(false);
    };

    const handleUserActivity = () => {
      resetTimer();
    };

    // Écouter les événements d'activité utilisateur
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    // Mettre à jour le timer
    timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= WARNING_TIME && !showWarning) {
      setShowWarning(true);
    }
  }, [timeLeft, showWarning]);

  const handleContinue = async () => {
    setIsRefreshing(true);
    try {
      await refreshSession();
      setTimeLeft(SESSION_TIMEOUT);
      setShowWarning(false);
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Votre session va expirer</DialogTitle>
          <DialogDescription>
            Votre session expirera dans {formatTime(timeLeft)} si vous ne prenez aucune action.
            Souhaitez-vous rester connecté?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={handleContinue} 
            disabled={isRefreshing}
            className="w-full"
          >
            {isRefreshing ? (
              <span className="flex items-center">
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Rafraîchissement...
              </span>
            ) : (
              'Continuer ma session'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTimeoutIndicator;
