import { useEffect } from 'react';
import { toast } from 'sonner';
import echo from '../lib/echo';

interface NotificationProps {
    channel: string;
    event: string;
}

export const NotificationSystem = ({ channel, event }: NotificationProps) => {
    useEffect(() => {
        // S'abonner au canal
        const channelInstance = echo.channel(channel);

        // Écouter l'événement
        channelInstance.listen(event, (data: any) => {
            toast.info(data.message || 'Nouvelle notification');
        });

        // Nettoyage lors du démontage du composant
        return () => {
            channelInstance.stopListening(event);
        };
    }, [channel, event]);

    return null;
}; 