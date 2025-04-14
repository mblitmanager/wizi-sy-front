import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { quizService } from '@/services/quizService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer } from '@/components/ui/timer';
import  QuizQuestion  from './QuizQuestion';
import  QuizResult  from './QuizResult';
import  QuizCard  from './QuizCard';

interface Question {
  id: number;
  text: string;
  image?: string;
  type: 'single' | 'multiple';
  answers: Answer[];
  category: string;
  difficulty: number;
}

interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface QuizProps {
  level: 'beginner' | 'intermediate' | 'advanced' | 'super';
  mode: 'normal' | 'challenge' | 'discovery' | 'practice';
  category?: string;
}

export const QuizComponent: React.FC<QuizProps> = ({ level, mode, category }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  const questionCount = {
    beginner: 5,
    intermediate: 10,
    advanced: 15,
    super: 20
  }[level];

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        const quizData = await quizService.getQuiz(level, questionCount, category);
        setQuestions(quizData.questions);
        setTimeLeft(quizData.duration);
      } catch (err) {
        setError('Erreur lors du chargement du quiz');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [level, questionCount, category]);

  const handleAnswerSelect = (answerId: number) => {
    const currentQuestionData = questions[currentQuestion];
    
    if (currentQuestionData.type === 'single') {
      setSelectedAnswers([answerId]);
      checkAnswer([answerId]);
    } else {
      setSelectedAnswers(prev => 
        prev.includes(answerId)
          ? prev.filter(id => id !== answerId)
          : [...prev, answerId]
      );
    }
  };

  const checkAnswer = (selectedIds: number[]) => {
    const currentQuestionData = questions[currentQuestion];
    const correctAnswers = currentQuestionData.answers
      .filter(a => a.isCorrect)
      .map(a => a.id);
    
    const isCorrect = selectedIds.length === correctAnswers.length &&
      selectedIds.every(id => correctAnswers.includes(id));

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) {
          setMaxStreak(newStreak);
        }
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswers([]);
      setShowExplanation(false);
    } else {
      setShowResults(true);
      // Sauvegarder le score et les statistiques
      quizService.saveQuizResult({
        score,
        maxStreak,
        level,
        mode,
        category,
        questionsAnswered: questions.length
      });
    }
  };

  if (isLoading) {
    return <QuizCard loading />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (showResults) {
    return (
      <QuizResult 
        score={score}
        totalQuestions={questions.length}
        maxStreak={maxStreak}
        level={level}
        mode={mode}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Question {currentQuestion + 1}/{questions.length}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Badge>
            {streak > 0 && (
              <Badge variant="secondary">
                Streak: {streak}
              </Badge>
            )}
          </div>
        </div>
        <Timer timeLeft={timeLeft} onTimeUp={() => setShowResults(true)} />
      </CardHeader>
      <CardContent>
        <QuizQuestion
          question={currentQuestionData}
          selectedAnswers={selectedAnswers}
          onAnswerSelect={handleAnswerSelect}
          showExplanation={showExplanation}
          mode={mode}
        />
        
        <div className="flex justify-between mt-4">
          <Progress 
            value={(currentQuestion / questions.length) * 100} 
            className="w-full"
          />
        </div>

        <Button 
          className="w-full mt-4"
          onClick={handleNext}
          disabled={!showExplanation && selectedAnswers.length === 0}
        >
          {currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant'}
        </Button>
      </CardContent>
    </Card>
  );
}; 