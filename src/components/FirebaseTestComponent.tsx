// Importez les instances nécessaires
import { app, auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, AuthError, User } from 'firebase/auth';

function FirebaseTestComponent() {
  const [message, setMessage] = useState('Initializing Firebase...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Vérification de l'instance Firebase
      if (!app) {
        throw new Error('Firebase app instance is not initialized');
      }
      console.log('Firebase app initialized:', app);

      // Test de l'authentification
      const firebaseAuth = getAuth(app);
      if (!firebaseAuth) {
        throw new Error('Firebase Auth instance is not initialized');
      }
      setMessage('Firebase initialized successfully. Checking auth state...');

      // Écoute des changements d'état d'authentification
      const unsubscribe = onAuthStateChanged(firebaseAuth, 
        (user: User | null) => {
          if (user) {
            console.log('User is signed in:', user);
            setMessage('Firebase Auth: User is signed in.');
            setError(null);
          } else {
            console.log('User is signed out.');
            setMessage('Firebase Auth: User is signed out.');
            setError(null);
          }
        },
        (error: AuthError) => {
          console.error('Auth state change error:', error);
          setError(`Auth error: ${error.code} - ${error.message}`);
        }
      );

      return () => unsubscribe();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error initializing Firebase:', error);
      setError(`Error initializing Firebase: ${errorMessage}`);
      setMessage('Failed to initialize Firebase');
    }
  }, []);

  return (
    <div>
      <h2>Firebase Test</h2>
      <p>{message}</p>
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default FirebaseTestComponent;