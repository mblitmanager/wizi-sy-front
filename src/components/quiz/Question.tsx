import React, { useState } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { HelpCircle, Volume2 } from 'lucide-react';
import { 
  Question as QuizQuestion, 
  QuestionType, 
  MultipleChoiceAnswer, 
  OrderingAnswer, 
  FillInBlankAnswer, 
  WordBankAnswer, 
  FlashcardAnswer, 
  MatchingAnswer 
} from '@/services/QuizService';

interface QuestionProps {
  question: QuizQuestion;
  onAnswer: (answer: any) => void;
  showFeedback?: boolean;
}

const Question: React.FC<QuestionProps> = ({ question, onAnswer, showFeedback = false }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);

  const handleAnswer = (answer: any) => {
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const renderMultipleChoice = () => {
    const answers = question.reponses as MultipleChoiceAnswer[];
    return (
      <FormControl component="fieldset">
        <RadioGroup
          value={selectedAnswer}
          onChange={(e) => handleAnswer(e.target.value)}
        >
          {answers.map((answer) => (
            <FormControlLabel
              key={answer.id}
              value={answer.id}
              control={<Radio />}
              label={answer.text}
              disabled={showFeedback}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  };

  const renderWordBank = () => {
    if (question.type !== 'banque de mots') return null;
    const answers = question.reponses.filter((answer): answer is WordBankAnswer => 
      'bank_group' in answer
    );
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {answers.map((answer) => (
          <Box key={answer.id}>
            <TextField
              label={`Mot ${answer.bank_group}`}
              value={selectedAnswer?.[answer.bank_group] || ''}
              onChange={(e) => handleAnswer({ ...selectedAnswer, [answer.bank_group]: e.target.value })}
              disabled={showFeedback}
              fullWidth
              margin="normal"
            />
          </Box>
        ))}
      </Box>
    );
  };

  const renderFlashcard = () => {
    const answer = question.reponses[0] as FlashcardAnswer;
    return (
      <Card>
        <CardContent>
          <Typography variant="h6">{answer.text}</Typography>
          {showFeedback && (
            <Typography variant="body1" mt={2}>
              {answer.flashcard_back}
            </Typography>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderMatching = () => {
    const answers = question.reponses as MatchingAnswer[];
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {answers.map((answer) => (
          <Box key={answer.id} display="flex" alignItems="center" gap={2}>
            <Typography>{answer.text}</Typography>
            <TextField
              value={selectedAnswer?.[answer.id] || ''}
              onChange={(e) => handleAnswer({ ...selectedAnswer, [answer.id]: e.target.value })}
              disabled={showFeedback}
              placeholder={`Correspondance pour "${answer.text}"`}
            />
          </Box>
        ))}
      </Box>
    );
  };

  const renderOrdering = () => {
    const answers = question.reponses as OrderingAnswer[];
    return (
      <List>
        {answers.map((answer) => (
          <ListItem
            key={answer.id}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              mb: 1,
              cursor: showFeedback ? 'default' : 'move',
            }}
          >
            <ListItemText primary={answer.text} />
            {!showFeedback && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => handleReorder(answer.id, 'up')}>
                  ↑
                </IconButton>
                <IconButton size="small" onClick={() => handleReorder(answer.id, 'down')}>
                  ↓
                </IconButton>
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    );
  };

  const handleReorder = (id: number, direction: 'up' | 'down') => {
    const answers = question.reponses as OrderingAnswer[];
    const currentIndex = answers.findIndex(a => a.id === id);
    if (direction === 'up' && currentIndex > 0) {
      const newOrder = [...answers];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
      handleAnswer(newOrder.map((a, i) => ({ id: a.id, position: i + 1 })));
    } else if (direction === 'down' && currentIndex < answers.length - 1) {
      const newOrder = [...answers];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      handleAnswer(newOrder.map((a, i) => ({ id: a.id, position: i + 1 })));
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {question.text}
          {question.astuce && (
            <Tooltip title={question.astuce}>
              <IconButton size="small" sx={{ ml: 1 }}>
                <HelpCircle size={20} />
              </IconButton>
            </Tooltip>
          )}
        </Typography>
        {question.media_url && question.type === 'question audio' && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <audio controls>
              <source src={question.media_url} type="audio/mpeg" />
              Votre navigateur ne supporte pas l'élément audio.
            </audio>
          </Box>
        )}
      </Box>

      {(() => {
        switch (question.type) {
          case 'choix multiples':
          case 'vrai/faux':
            return renderMultipleChoice();
          case 'banque de mots':
            return renderWordBank();
          case 'flashcard':
            return renderFlashcard();
          case 'correspondance':
            return renderMatching();
          case 'rearrangement':
            return renderOrdering();
          default:
            return <Typography>Type de question non supporté</Typography>;
        }
      })()}

      {showFeedback && question.explication && (
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2">{question.explication}</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Question; 