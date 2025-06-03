import { useEffect } from 'react';
import { toast } from 'sonner';
import echo from '../lib/echo';

interface NotificationData {
    message: string;
    quiz?: {
        id: number;
        title: string;
    };
    media?: {
        id: number;
        title: string;
    };
}

export const ContentNotifications = () => {
    useEffect(() => {
        // S'abonner aux notifications de quiz
        const quizChannel = echo.channel('notifications');
        quizChannel.listen('quiz.created', (data: NotificationData) => {
            toast.success(data.message, {
                description: 'Cliquez pour voir le quiz',
                onClick: () => {
                    if (data.quiz) {
                        window.location.href = `/quiz/${data.quiz.id}`;
                    }
                }
            });
        });

        // S'abonner aux notifications de médias
        const mediaChannel = echo.channel('notifications');
        mediaChannel.listen('media.created', (data: NotificationData) => {
            toast.success(data.message, {
                description: 'Cliquez pour voir le média',
                onClick: () => {
                    if (data.media) {
                        window.location.href = `/media/${data.media.id}`;
                    }
                }
            });
        });

        return () => {
            quizChannel.stopListening('quiz.created');
            mediaChannel.stopListening('media.created');
        };
    }, []);

    return null;
}; 