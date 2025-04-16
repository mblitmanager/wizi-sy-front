import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { quizService } from '@/services/quizService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer } from '@/components/ui/timer';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';
import QuizCard from './QuizCard';
import { Question, Answer } from '@/types/quiz';
import { QuizResult as QuizResultType } from '@/services/quizService';

interface QuizData {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  duration: number;
  level: 'débutant' | 'intermédiaire' | 'avancé' | 'super';
  mode: 'normal' | 'challenge' | 'discovery';
  category: string;
  categoryId: number;
  points: number;
}

interface QuizProps {
  level: 'beginner' | 'intermediate' | 'advanced' | 'super';
  mode: 'normal' | 'challenge' | 'discovery' | 'practice';
  category?: string;
}

const mapLevel = (level: QuizProps['level']): QuizData['level'] => {
  const levelMap: Record<QuizProps['level'], QuizData['level']> = {
    beginner: 'débutant',
    intermediate: 'intermédiaire',
    advanced: 'avancé',
    super: 'super'
  };
  return levelMap[level];
};

export const QuizComponent: React.FC<QuizProps> = ({ level, mode, category }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>([]);
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const questionCount = {
    beginner: 5,
    intermediate: 10,
    advanced: 15,
    super: 20
  }[level];

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const data = await quizService.getQuiz(mapLevel(level), questionCount, category);
        setQuizData(data);
        setQuestions(data.questions);
        setTimeLeft(data.duration);
      } catch (error) {
        console.error('Erreur lors du chargement du quiz:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [level, questionCount, category, mode]);

  const handleAnswerSelect = (answerId: string) => {
    const currentQuestionData = questions[currentQuestion];
    
    if (currentQuestionData.type === 'vrai faux') {
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

  const checkAnswer = (selectedIds: string[]) => {
    const currentQuestionData = questions[currentQuestion];
    
    // La réponse correcte est stockée dans correct_answer
    const isCorrect = selectedIds.some(id => id === currentQuestionData.correct_answer);

    if (isCorrect) {
      setScore(prev => prev + currentQuestionData.points);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > maxStreak) {
          setMaxStreak(newStreak);
        }
        return newStreak;
      });
      setCorrectAnswers(prev => [...prev, currentQuestionData.id]);
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
      // Sauvegarder le résultat du quiz
      const result: QuizResultType = {
        id: `result_${Date.now()}`,
        quizId: questions[0]?.quiz_id || '',
        userId: 'current-user',
        score: calculateScore(),
        correctAnswers: correctAnswers.length,
        totalQuestions: questions.length,
        completedAt: new Date().toISOString(),
        timeSpent: quizData?.duration - timeLeft || 0,
        maxStreak,
        mode
      };
      quizService.saveQuizResult(result);
    }
  };

  const calculateScore = () => {
    return Math.round((correctAnswers.length / questions.length) * 100);
  };

  if (isLoading) {
    return <QuizCard quiz={null} categoryColor="bg-blue-500" />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (showResults) {
    const result: QuizResultType = {
      id: `result_${Date.now()}`,
      quizId: questions[0]?.quiz_id || '',
      userId: 'current-user',
      score: calculateScore(),
      correctAnswers: correctAnswers.length,
      totalQuestions: questions.length,
      completedAt: new Date().toISOString(),
      timeSpent: quizData?.duration - timeLeft || 0,
      maxStreak,
      mode
    };

    return (
      <QuizResult
        result={result}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
      <Card className="w-full max-w-2xl mx-auto flex flex-col">
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
            totalQuestions={questions.length}
            currentQuestion={currentQuestion + 1}
            onAnswer={handleAnswerSelect}
            timeLimit={timeLeft}
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
    </div>
  );
}; 