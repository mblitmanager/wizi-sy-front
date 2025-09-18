import React from 'react';
import { useQuizPreferences } from '@/hooks/useQuizPreferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Composant de démonstration pour tester les préférences de quiz
 * Affiche l'état actuel et permet de tester les fonctionnalités
 */
export const QuizPreferencesDemo: React.FC = () => {
    const {
        viewMode,
        isLoading,
        savePreference,
        toggleViewMode,
        prefersAdventure,
        prefersList
    } = useQuizPreferences();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Préférences Quiz</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Chargement des préférences...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Préférences Quiz</CardTitle>
                <CardDescription>
                    Test des préférences utilisateur pour les quiz
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <p className="text-sm font-medium">Mode actuel :</p>
                    <p className={`text-lg font-bold ${viewMode === 'adventure' ? 'text-blue-600' : 'text-green-600'
                        }`}>
                        {viewMode === 'adventure' ? '🎮 Aventure' : '📋 Liste'}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <Button
                        variant={prefersAdventure() ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => savePreference('adventure')}
                    >
                        Vue Aventure
                    </Button>
                    <Button
                        variant={prefersList() ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => savePreference('list')}
                    >
                        Vue Liste
                    </Button>
                </div>

                <Button
                    onClick={toggleViewMode}
                    className="w-full"
                    variant="secondary"
                >
                    Basculer le mode
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                    <p>• Les préférences sont sauvegardées dans localStorage</p>
                    <p>• Le mode par défaut est "Aventure"</p>
                    <p>• La page Quizzes utilisera automatiquement cette préférence</p>
                </div>
            </CardContent>
        </Card>
    );
};
