import React from 'react';
import ReactPlayer from 'react-player';

export interface Media {
    id: number;
    titre: string;
    description?: string;
    url: string;
    video_platform: 'youtube' | 'dailymotion' | 'server';
    video_file_path?: string;
    type: string;
    categorie: string;
}

interface UniversalVideoPlayerProps {
    media: Media;
    playing?: boolean;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onProgress?: (state: { played: number; playedSeconds: number }) => void;
    onReady?: () => void;
}

/**
 * Universal video player that supports YouTube, Dailymotion, and server-hosted videos
 */
const UniversalVideoPlayer: React.FC<UniversalVideoPlayerProps> = ({
    media,
    playing = false,
    onPlay,
    onPause,
    onEnded,
    onProgress,
    onReady,
}) => {
    const getVideoUrl = (): string => {
        switch (media.video_platform) {
            case 'youtube':
            case 'dailymotion':
                return media.url;
            case 'server':
                // For server-hosted videos, the URL should already be the full path
                return media.url;
            default:
                return media.url;
        }
    };

    const getThumbnail = (): string | undefined => {
        switch (media.video_platform) {
            case 'youtube': {
                // Extract YouTube video ID
                const match = media.url.match(
                    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/
                );
                return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : undefined;
            }
            case 'dailymotion': {
                // Extract Dailymotion video ID
                const match = media.url.match(/(?:dailymotion\.com\/(?:video|hub)\/|dai\.ly\/)([a-zA-Z0-9]+)/);
                return match ? `https://www.dailymotion.com/thumbnail/video/${match[1]}` : undefined;
            }
            case 'server':
                // Server videos might not have thumbnails, or you could generate them
                return undefined;
            default:
                return undefined;
        }
    };

    return (
        <div className="universal-video-player" style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
            <ReactPlayer
                url={getVideoUrl()}
                playing={playing}
                controls
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                onPlay={onPlay}
                onPause={onPause}
                onEnded={onEnded}
                onProgress={onProgress}
                onReady={onReady}
                light={getThumbnail()}
                config={{
                    youtube: {
                        playerVars: { showinfo: 1 },
                    },
                    dailymotion: {
                        params: { controls: true },
                    },
                    file: {
                        attributes: {
                            controlsList: 'nodownload',
                        },
                    },
                }}
            />
        </div>
    );
};

export default UniversalVideoPlayer;
