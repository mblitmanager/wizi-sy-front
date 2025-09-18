import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuizPreferences } from '@/hooks/useQuizPreferences';
import { Loader2 } from 'lucide-react';

interface QuizViewManagerProps {
    children: React.ReactNode;
}

/**
 * Composant qui gère la redirection automatique vers la vue préférée de l'utilisateur
 * S'assure que l'utilisateur voit sa vue préférée par défaut
 */
export const QuizViewManager: React.FC<QuizViewManagerProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { viewMode, isLoading, prefersAdventure } = useQuizPreferences();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        if (isLoading || hasRedirected) return;

        const params = new URLSearchParams(location.search);
        const urlToggle = params.get('toggle');

        // Si aucun paramètre URL et que l'utilisateur préfère l'aventure, rediriger
        if (!urlToggle && prefersAdventure() && location.pathname === '/quizzes') {
            navigate('/quizzes?toggle=adventure', { replace: true });
            setHasRedirected(true);
        }
        // Si aucun paramètre URL et que l'utilisateur préfère la liste, rediriger
        else if (!urlToggle && !prefersAdventure() && location.pathname === '/quizzes') {
            navigate('/quizzes?toggle=mes-quizzes', { replace: true });
            setHasRedirected(true);
        }
    }, [isLoading, hasRedirected, location, navigate, prefersAdventure]);

    // Afficher un loader pendant l'initialisation
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return <>{children}</>;
};
