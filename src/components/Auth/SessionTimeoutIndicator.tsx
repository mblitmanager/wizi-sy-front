
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Session warning time in milliseconds (show warning 5 minutes before expiration)
const WARNING_TIME = 5 * 60 * 1000;
const SESSION_EXPIRATION = 2 * 60 * 60 * 1000;

export const SessionTimeoutIndicator: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { refreshSession, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSessionStatus = () => {
      const sessionTimestamp = localStorage.getItem('sessionTimestamp');
      if (!sessionTimestamp) return;

      const elapsed = Date.now() - parseInt(sessionTimestamp);
      const remaining = SESSION_EXPIRATION - elapsed;

      if (remaining <= WARNING_TIME && remaining > 0) {
        setShowWarning(true);
        setTimeLeft(Math.floor(remaining / 1000));
      } else {
        setShowWarning(false);
      }
    };

    // Check every minute
    const intervalId = setInterval(checkSessionStatus, 60 * 1000);
    checkSessionStatus(); // Check immediately

    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  // Count down every second when warning is showing
  useEffect(() => {
    if (showWarning && timeLeft > 0) {
      const countDownInterval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(countDownInterval);
    }
  }, [showWarning, timeLeft]);

  const handleContinue = async () => {
    await refreshSession();
    setShowWarning(false);
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
        </DialogHeader>
        <div className="py-4">
          <p>Votre session expirera dans {formatTime(timeLeft)} si vous ne prenez aucune action.</p>
          <p className="mt-2">Souhaitez-vous rester connecté?</p>
        </div>
        <DialogFooter>
          <Button onClick={handleContinue}>Continuer ma session</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTimeoutIndicator;
