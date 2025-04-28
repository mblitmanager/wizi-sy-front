
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { CheckCircle, XCircle } from 'lucide-react';

interface MultipleChoiceProps {
  question: any;
  onAnswer: (selectedAnswers: string[]) => void;
  showFeedback?: boolean;
}

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question,
  onAnswer,
  showFeedback = false,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const isMultipleAnswers = question.reponses?.filter((r: any) => r.isCorrect || r.is_correct === 1).length > 1;

  const handleSingleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedAnswers([value]);
    onAnswer([value]);
    setSubmitted(true);
  };

  const handleMultipleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newSelected = [...selectedAnswers];

    if (newSelected.includes(value)) {
      setSelectedAnswers(newSelected.filter((id) => id !== value));
    } else {
      newSelected.push(value);
      setSelectedAnswers(newSelected);
    }
  };

  const handleSubmitMultiple = () => {
    onAnswer(selectedAnswers);
    setSubmitted(true);
  };

  const getCorrectAnswers = () => {
    return question.reponses
      .filter((r: any) => r.isCorrect || r.is_correct === 1)
      .map((r: any) => r.id.toString());
  };

  const isCorrect = () => {
    const correctAnswers = getCorrectAnswers();
    if (correctAnswers.length !== selectedAnswers.length) return false;
    return correctAnswers.every((id) => selectedAnswers.includes(id.toString()));
  };

  if (isMultipleAnswers) {
    return (
      <Box>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormGroup>
            {question.reponses?.map((reponse: any) => (
              <FormControlLabel
                key={reponse.id}
                control={
                  <Checkbox
                    checked={selectedAnswers.includes(reponse.id.toString())}
                    onChange={handleMultipleChange}
                    value={reponse.id.toString()}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{reponse.text}</Typography>
                    {submitted && showFeedback && (
                      <>
                        {(reponse.isCorrect || reponse.is_correct === 1) && (
                          <CheckCircle color="success" size={18} />
                        )}
                        {!(reponse.isCorrect || reponse.is_correct === 1) &&
                          selectedAnswers.includes(reponse.id.toString()) && (
                            <XCircle color="error" size={18} />
                          )}
                      </>
                    )}
                  </Box>
                }
                sx={{
                  marginY: 1,
                  padding: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            ))}
          </FormGroup>
          {!submitted && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitMultiple}
              sx={{ marginTop: 2 }}
            >
              Valider
            </Button>
          )}
        </FormControl>
        {submitted && showFeedback && (
          <Box mt={2} p={2} bgcolor={isCorrect() ? 'success.light' : 'error.light'} borderRadius={1}>
            <Typography color={isCorrect() ? 'success.contrastText' : 'error.contrastText'}>
              {isCorrect() ? 'Bonne réponse !' : 'Réponse incorrecte.'}
            </Typography>
          </Box>
        )}
      </Box>
    );
  } else {
    return (
      <Box>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <RadioGroup
            value={selectedAnswers[0] || ''}
            onChange={handleSingleChange}
            sx={{ width: '100%' }}
          >
            {question.reponses?.map((reponse: any) => (
              <FormControlLabel
                key={reponse.id}
                value={reponse.id.toString()}
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{reponse.text}</Typography>
                    {submitted && showFeedback && (
                      <>
                        {(reponse.isCorrect || reponse.is_correct === 1) && (
                          <CheckCircle color="success" size={18} />
                        )}
                        {!(reponse.isCorrect || reponse.is_correct === 1) &&
                          selectedAnswers.includes(reponse.id.toString()) && (
                            <XCircle color="error" size={18} />
                          )}
                      </>
                    )}
                  </Box>
                }
                sx={{
                  marginY: 1,
                  padding: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
        {submitted && showFeedback && (
          <Box mt={2} p={2} bgcolor={isCorrect() ? 'success.light' : 'error.light'} borderRadius={1}>
            <Typography color={isCorrect() ? 'success.contrastText' : 'error.contrastText'}>
              {isCorrect() ? 'Bonne réponse !' : 'Réponse incorrecte.'}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
};
