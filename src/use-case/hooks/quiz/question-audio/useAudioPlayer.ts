import { useState, useRef, useEffect } from "react";
import { Question as QuizQuestion } from "@/types/quiz";

export const useAudioPlayer = (question: QuizQuestion) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const fullAudioUrl =
    typeof question.audioUrl === "string" &&
    question.audioUrl.startsWith("http")
      ? question.audioUrl
      : question.audioUrl
      ? `${import.meta.env.VITE_API_URL_MEDIA}/storage/${String(
          question.audioUrl
        )}`
      : "";

  useEffect(() => {
    setAudioError(false);
  }, [question]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setAudioError(true);
            setIsPlaying(false);
          });
        }
      }
      setIsPlaying(!isPlaying);
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

  return {
    isPlaying,
    volume,
    isMuted,
    audioError,
    handlePlayPause,
    handleVolumeChange,
    handleMuteToggle,
    audioRef,
  };
};
