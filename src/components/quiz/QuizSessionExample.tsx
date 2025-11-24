import React, { useEffect } from 'react';
import { useQuizSession } from '@/hooks/useQuizSession';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayIcon, TrashIcon, XIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Example component showing how to use quiz session management
 * Displays active quiz sessions and allows resuming or deleting them
 */
export function QuizSessionExample() {
    const {
        activeSessions,
        isLoading,
        error,
        deleteSession,
        loadActiveSessions,
        getMostRecentSession,
    } = useQuizSession();

    // Reload sessions when component mounts
    useEffect(() => {
        loadActiveSessions();
    }, [loadActiveSessions]);

    const handleResumeQuiz = (quizId: number) => {
        // Navigate to quiz page with resume parameter
        window.location.href = `/quiz/${quizId}?resume=true`;
    };

    const handleDeleteSession = async (sessionId: number) => {
        if (confirm('Voulez-vous vraiment supprimer cette progression ?')) {
            await deleteSession(sessionId);
        }
    };

    if (isLoading && activeSessions.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-muted-foreground">Chargement des sessions...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <p className="text-sm text-destructive">
                    Erreur lors du chargement des sessions : {error.message}
                </p>
            </div>
        );
    }

    const mostRecent = getMostRecentSession();

    return (
        <div className="space-y-6">
            {/* Most Recent Session - Featured */}
            {mostRecent && (
                <Card className="border-primary/50 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlayIcon className="h-5 w-5 text-primary" />
                            Reprendre le quiz
                        </CardTitle>
                        <CardDescription>
                            Continuez où vous vous êtes arrêté
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold">{mostRecent.quiz?.titre}</h3>
                                {mostRecent.quiz?.formation && (
                                    <p className="text-sm text-muted-foreground">
                                        {mostRecent.quiz.formation.titre}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Progression</span>
                                    <span className="font-medium">
                                        {mostRecent.current_index + 1} / {mostRecent.total_questions}
                                    </span>
                                </div>
                                <Progress value={mostRecent.progress_percentage} />
                                <p className="text-xs text-muted-foreground">
                                    Dernière activité :{' '}
                                    {formatDistanceToNow(new Date(mostRecent.last_activity_at), {
                                        addSuffix: true,
                                        locale: fr,
                                    })}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleResumeQuiz(mostRecent.quiz_id)}
                                    className="flex-1"
                                >
                                    <PlayIcon className="mr-2 h-4 w-4" />
                                    Reprendre
                                </Button>
                                <Button
                                    onClick={() => handleDeleteSession(mostRecent.id)}
                                    variant="outline"
                                    size="icon"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Other Active Sessions */}
            {activeSessions.length > 1 && (
                <div>
                    <h3 className="mb-4 text-lg font-semibold">Autres quiz en cours</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {activeSessions
                            .filter((s) => s.id !== mostRecent?.id)
                            .map((session) => (
                                <Card key={session.id}>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">
                                            {session.quiz?.titre}
                                        </CardTitle>
                                        {session.quiz?.formation && (
                                            <CardDescription className="text-xs">
                                                {session.quiz.formation.titre}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span>{session.progress_percentage}%</span>
                                                <span>
                                                    {session.current_index + 1}/{session.total_questions}
                                                </span>
                                            </div>
                                            <Progress value={session.progress_percentage} className="h-1" />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleResumeQuiz(session.quiz_id)}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                Reprendre
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteSession(session.id)}
                                                variant="ghost"
                                                size="sm"
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {activeSessions.length === 0 && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <PlayIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mb-2 font-semibold">Aucun quiz en cours</h3>
                        <p className="text-center text-sm text-muted-foreground">
                            Commencez un quiz pour voir votre progression ici
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

/**
 * Example usage in a quiz component
 * Shows how to save session progress during quiz
 */
export function QuizSessionUsageExample() {
    const { saveSession } = useQuizSession();

    const handleAnswerQuestion = async (
        quizId: number,
        questionIds: number[],
        currentIndex: number,
        answers: Record<string, string[]>,
        timeSpent: number
    ) => {
        try {
            // Save session after each answer
            await saveSession({
                quiz_id: quizId,
                question_ids: questionIds,
                current_index: currentIndex,
                answers: answers,
                time_spent: timeSpent,
            });

            console.log('Session saved successfully');
        } catch (error) {
            console.error('Failed to save session:', error);
            // Error toast is shown automatically by the hook
        }
    };

    return (
        <div>
            {/* Your quiz UI here */}
            {/* Call handleAnswerQuestion after each answer */}
        </div>
    );
}
