// Importez les instances nécessaires
import { app, auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Importez les fonctions spécifiques si nécessaire

function FirebaseTestComponent() {
  const [message, setMessage] = useState('Initializing Firebase...');

  useEffect(() => {
    try {
      // `app` est l'instance de l'application Firebase
      console.log('Firebase app initialized:', app);

      // Testons le service d'authentification
      const firebaseAuth = getAuth(app); // Obtenez l'instance d'authentification via l'application
      setMessage('Firebase initialized successfully. Checking auth state...');

      // Écoutez les changements d'état d'authentification (facultatif mais bon pour le test)
      const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          console.log('User is signed in:', user);
          setMessage('Firebase Auth: User is signed in.');
        } else {
          console.log('User is signed out.');
          setMessage('Firebase Auth: User is signed out.');
        }
      });

      // Retourne une fonction de nettoyage pour l'écouteur d'état d'authentification
      return () => unsubscribe();

    } catch (error: any) {
      console.error('Error initializing Firebase:', error);
      setMessage(`Error initializing Firebase: ${error.message}`);
    }
  }, []); // Le tableau vide assure que cet effet ne s'exécute qu'une seule fois au montage

  return (
    <div>
      <h2>Firebase Test</h2>
      <p>{message}</p>
      {/* Vous pouvez ajouter d'autres éléments de test ici */}
    </div>
  );
}

export default FirebaseTestComponent;