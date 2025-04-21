import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { quizService } from '@/services/quizService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Timer } from '@/components/ui/timer';
import { Question, Quiz, QuizResult } from '@/types/quiz';

interface QuizProps {
  level: 'beginner' | 'intermediate' | 'advanced' | 'super';
  mode: 'normal' | 'challenge' | 'discovery' | 'practice';
  category?: string;
}

const mapLevel = (level: QuizProps['level']): string => {
  const levelMap: Record<QuizProps['level'], string> = {
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
  const [quizData, setQuizData] = useState<Quiz | null>(null);

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
        if (data) {
          setQuizData(data);
          setQuestions(data.questions);
          setTimeLeft(data.duree);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du quiz:', error);
        setError('Erreur lors du chargement du quiz');
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
    
    // Vérifier si toutes les réponses sélectionnées sont correctes
    const isCorrect = selectedIds.every(id => {
      const response = currentQuestionData.reponses.find(r => r.id === id);
      return response?.is_correct;
    });

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
      const result: QuizResult = {
        id: `result_${Date.now()}`,
        quiz_id: quizData?.id || '',
        user_id: 'current-user',
        score: calculateScore(),
        correct_answers: correctAnswers.length,
        total_questions: questions.length,
        completed_at: new Date().toISOString(),
        time_spent: quizData?.duree - timeLeft || 0,
        max_streak: maxStreak,
        mode
      };
      quizService.submitQuiz(quizData?.id || '', {});
    }
  };

  const calculateScore = () => {
    return Math.round((correctAnswers.length / questions.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (showResults) {
    return (
      <div className="container mx-auto px-4 pb-20 md:pb-4 max-w-7xl">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Résultats du Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Score: {calculateScore()}%</p>
              <p>Réponses correctes: {correctAnswers.length}/{questions.length}</p>
              <p>Meilleur streak: {maxStreak}</p>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
          <div className="space-y-4">
            <p className="text-lg font-medium">{currentQuestionData.text}</p>
            {currentQuestionData.media_url && (
              <img 
                src={currentQuestionData.media_url} 
                alt="Question media" 
                className="max-w-full h-auto rounded-lg"
              />
            )}
            <div className="space-y-2">
              {currentQuestionData.reponses.map((response) => (
                <Button
                  key={response.id}
                  variant={selectedAnswers.includes(response.id) ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleAnswerSelect(response.id)}
                >
                  {response.text}
                </Button>
              ))}
            </div>
            {showExplanation && currentQuestionData.explication && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="font-medium">Explication :</p>
                <p>{currentQuestionData.explication}</p>
              </div>
            )}
            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
              >
                Précédent
              </Button>
              <Button onClick={handleNext}>
                {currentQuestion === questions.length - 1 ? 'Terminer' : 'Suivant'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 