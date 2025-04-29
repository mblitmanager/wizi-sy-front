
import React, { useState, useEffect } from 'react';
import { FormControl, FormLabel, TextField, Box, Typography } from '@mui/material';
import { Question } from '@/types/quiz';

interface FillBlankProps {
  question: Question;
  onAnswer: (answer: Record<string, string>) => void;
  showFeedback?: boolean;
}

export function FillBlank({ question, onAnswer, showFeedback = false }: FillBlankProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Parse question text to identify blank fields
  const parseQuestionText = () => {
    const regex = /{(.*?)}/g;
    const blanks = [];
    let match;
    
    while ((match = regex.exec(question.text)) !== null) {
      blanks.push(match[1]);
    }
    
    return blanks;
  };

  const blanks = parseQuestionText();

  // Initialize answers from any existing selected answers
  useEffect(() => {
    if (question.selectedAnswers && typeof question.selectedAnswers === 'object' && !Array.isArray(question.selectedAnswers)) {
      // Create a new object to store the answers
      const initialAnswers: Record<string, string> = {};
      
      // Safely handle the type casting
      const selectedAnswers = question.selectedAnswers as Record<string, string>;
      
      // Copy the values
      Object.keys(selectedAnswers).forEach(key => {
        initialAnswers[key] = selectedAnswers[key];
      });
      
      setAnswers(initialAnswers);
    }
  }, [question.selectedAnswers]);

  const handleChange = (blankId: string, value: string) => {
    const newAnswers = { ...answers, [blankId]: value };
    setAnswers(newAnswers);
    onAnswer(newAnswers);
  };

  // Replace blanks in question text with input fields
  const renderQuestionWithInputs = () => {
    let parts = question.text.split(/({.*?})/g);
    
    return parts.map((part, index) => {
      if (part.match(/^{.*}$/)) {
        const blankId = part.substring(1, part.length - 1);
        const correctAnswer = question.answers?.find(a => a.bank_group === blankId)?.text;
        const isCorrect = showFeedback && answers[blankId] === correctAnswer;
        const isIncorrect = showFeedback && answers[blankId] && answers[blankId] !== correctAnswer;
        
        return (
          <TextField
            key={index}
            value={answers[blankId] || ''}
            onChange={(e) => handleChange(blankId, e.target.value)}
            variant="outlined"
            size="small"
            disabled={showFeedback}
            error={isIncorrect}
            sx={{
              mx: 1,
              width: '150px',
              bgcolor: isCorrect ? 'rgba(0, 200, 0, 0.1)' : 'transparent',
            }}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Show feedback
  const renderFeedback = () => {
    if (!showFeedback) return null;
    
    return blanks.map(blankId => {
      const correctAnswer = question.answers?.find(a => a.bank_group === blankId)?.text;
      const userAnswer = answers[blankId];
      const isCorrect = userAnswer === correctAnswer;
      
      if (!isCorrect && correctAnswer) {
        return (
          <Typography key={blankId} color="error" sx={{ mt: 2 }}>
            Pour {blankId}, la réponse correcte était: <strong>{correctAnswer}</strong>
          </Typography>
        );
      }
      return null;
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <FormControl fullWidth>
        <FormLabel component="legend" sx={{ mb: 2 }}>
          {renderQuestionWithInputs()}
        </FormLabel>
        {renderFeedback()}
      </FormControl>
    </Box>
  );
}
