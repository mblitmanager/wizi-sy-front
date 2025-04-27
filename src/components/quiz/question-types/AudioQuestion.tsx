import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Slider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Play, Pause, Volume2, VolumeX, Check, X } from 'lucide-react';
import { Question as QuizQuestion } from '@/types/quiz';

interface AudioQuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  showFeedback?: boolean;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const AudioPlayer = styled('audio')({
  width: '100%',
  marginBottom: '16px',
});

export const AudioQuestion: React.FC<AudioQuestionProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    const volumeValue = Array.isArray(newValue) ? newValue[0] : newValue;
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

  const handleAnswer = (answerId: string) => {
    setSelectedAnswer(answerId);
    onAnswer(answerId);
  };

  const isCorrectAnswer = (answerId: string) => {
    if (!showFeedback) return undefined;
    const answer = question.reponses?.find(a => a.id === answerId);
    return answer?.isCorrect;
  };

  return (
    <StyledPaper>
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          {question.text}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton
            onClick={handlePlayPause}
            color="primary"
            disabled={!question.audioUrl}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </IconButton>
          <Box flex={1}>
            <AudioPlayer
              ref={audioRef}
              src={question.audioUrl}
              onEnded={() => setIsPlaying(false)}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={1} width={200}>
            <IconButton onClick={handleMuteToggle} size="small">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </IconButton>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              min={0}
              max={1}
              step={0.1}
              size="small"
            />
          </Box>
        </Box>
      </Box>

      <List>
        {question.reponses?.map((answer) => (
          <ListItem key={answer.id} disablePadding>
            <ListItemButton
              onClick={() => handleAnswer(answer.id)}
              selected={selectedAnswer === answer.id}
              disabled={showFeedback}
            >
              <ListItemText primary={answer.text} />
              {showFeedback && selectedAnswer === answer.id && (
                <Box display="flex" alignItems="center" ml={2}>
                  {isCorrectAnswer(answer.id) ? (
                    <Check color="green" size={20} />
                  ) : (
                    <X color="red" size={20} />
                  )}
                </Box>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {showFeedback && selectedAnswer && !isCorrectAnswer(selectedAnswer) && (
        <Box mt={2}>
          <Typography color="error">
            La réponse correcte était :{' '}
            {question.reponses?.find(a => a.isCorrect)?.text}
          </Typography>
        </Box>
      )}
    </StyledPaper>
  );
};
