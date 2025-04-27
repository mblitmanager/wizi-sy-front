
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import type { Question } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingState } from "./quiz-play/LoadingState";
import { ErrorState } from "./quiz-play/ErrorState";
import { QuestionDisplay } from "./quiz-play/QuestionDisplay";
import { QuizTimer } from "./quiz-play/Timer";

type QuestionValue = string | string[] | Record<string, string>;

export function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, QuestionValue>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => quizSubmissionService.getQuizQuestions(parseInt(id!)),
    enabled: !!id && !!localStorage.getItem('token')
  });

  // Early returns for loading and error states
  if (isLoading) return <LoadingState />;
  if (error || !quiz) return <ErrorState />;

  const handleAnswerChange = (value: QuestionValue) => {
    const currentQuestion = quiz?.questions[currentQuestionIndex];
    if (currentQuestion) {
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: value
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHint(false);
    } else {
      calculateAndSetScore();
      setShowSummary(true);
    }
  };

  const calculateAndSetScore = () => {
    const newScore = quiz?.questions.reduce((acc, question) => {
      const userAnswer = userAnswers[question.id];
      let isCorrect = false;

      switch (question.type) {
        case 'choix multiples':
        case 'vrai/faux':
        case 'question audio':
          isCorrect = question.answers?.find(a => 
            a.id === userAnswer && (a.isCorrect || a.reponse_correct)
          ) !== undefined;
          break;

        case 'rearrangement':
          const userOrder = userAnswer as string[];
          const correctOrder = question.answers?.sort((a, b) => 
            (a.position || 0) - (b.position || 0)
          ).map(a => a.id);
          isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
          break;

        case 'remplir le champ vide':
        case 'banque de mots':
          const answers = userAnswer as Record<string, string>;
          isCorrect = question.blanks?.every(blank => {
            const userText = answers[blank.bankGroup];
            return userText?.toLowerCase() === blank.text.toLowerCase();
          }) || false;
          break;

        case 'correspondance':
          const matches = userAnswer as Record<string, string>;
          isCorrect = question.matching?.every(item => {
            const matchedItem = question.matching?.find(m => 
              matches[item.id] === m.id || matches[m.id] === item.id
            );
            return matchedItem?.matchPair === item.matchPair;
          }) || false;
          break;

        case 'carte flash':
          isCorrect = true;
          break;
      }

      return acc + (isCorrect ? (question.points || 1) : 0);
    }, 0) || 0;

    setScore(newScore);
  };

  const handleSubmitQuiz = async () => {
    try {
      const formattedAnswers: Record<string, string[]> = {};
      Object.entries(userAnswers).forEach(([questionId, answer]) => {
        formattedAnswers[questionId] = Array.isArray(answer) ? answer : [answer as string];
      });

      await quizSubmissionService.submitQuiz(id!, formattedAnswers, timeSpent);
      navigate('/quiz/history');
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestion.id];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{quiz.titre}</h1>
        <QuizTimer timeSpent={timeSpent} setTimeSpent={setTimeSpent} isActive={!showSummary} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Question {currentQuestionIndex + 1} sur {quiz.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestion.astuce && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Info className="h-4 w-4" />
              <button 
                onClick={() => setShowHint(!showHint)}
                className="hover:text-primary"
              >
                {showHint ? "Masquer l'astuce" : "Voir l'astuce"}
              </button>
              {showHint && <span>{currentQuestion.astuce}</span>}
            </div>
          )}

          <QuestionDisplay 
            question={currentQuestion} 
            onAnswer={handleAnswerChange}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleNextQuestion}
              disabled={!currentAnswer}
            >
              {currentQuestionIndex === quiz.questions.length - 1
                ? "Terminer"
                : "Question suivante"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
