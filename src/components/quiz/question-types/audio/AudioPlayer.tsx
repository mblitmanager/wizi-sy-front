
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AudioPlayerProps {
  audioUrl: string;
  onError: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  onError
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(error => {
              console.error("Audio playback error:", error);
              setAudioError(true);
              setIsPlaying(false);
              onError();
            });
        }
      }
    }
  };

  const handleVolumeChange = (newValue: number[]) => {
    const volumeValue = newValue[0];
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-muted rounded-md">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handlePlayPause}
            disabled={audioError}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onError={(e) => {
              console.error("Audio error:", e);
              setAudioError(true);
              setIsPlaying(false);
              onError();
            }}
          />
        </div>

        <div className="flex-1 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleMuteToggle}
            disabled={audioError}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1">
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              disabled={audioError}
            />
          </div>
        </div>
      </div>

      {audioError && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Impossible de charger le fichier audio. Veuillez continuer avec le test en lisant les options.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
