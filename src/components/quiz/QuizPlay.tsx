
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
import { QuizSummary } from "./QuizSummary";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  const [showAnswerDialog, setShowAnswerDialog] = useState(false);

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => quizSubmissionService.getQuizQuestions(parseInt(id!)),
    enabled: !!id && !!localStorage.getItem('token')
  });

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

  const handleNextQuestion = async () => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    setShowAnswerDialog(true);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setTimeout(() => {
        setShowAnswerDialog(false);
        setCurrentQuestionIndex(prev => prev + 1);
        setShowHint(false);
      }, 3000);
    } else {
      await handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const formattedAnswers: Record<string, string[]> = {};
      Object.entries(userAnswers).forEach(([questionId, answer]) => {
        formattedAnswers[questionId] = Array.isArray(answer) ? answer : [answer as string];
      });

      const result = await quizSubmissionService.submitQuiz(id!, formattedAnswers, timeSpent);
      setScore(result.score);
      setShowAnswerDialog(false);
      setShowSummary(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestion.id];

  if (showSummary) {
    return (
      <QuizSummary
        questions={quiz.questions}
        userAnswers={userAnswers}
        score={score}
        totalQuestions={quiz.questions.length}
      />
    );
  }

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

      <Dialog open={showAnswerDialog} onOpenChange={setShowAnswerDialog}>
        <DialogContent>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-4">
              {currentAnswer === quiz.questions[currentQuestionIndex].answers?.find(a => a.isCorrect)?.id
                ? "Bonne réponse !"
                : "Mauvaise réponse"}
            </h3>
            <div className="space-y-2">
              <p>La bonne réponse était :</p>
              <p className="font-medium text-green-600">
                {quiz.questions[currentQuestionIndex].answers?.find(a => a.isCorrect)?.text}
              </p>
              {currentQuestion.explication && (
                <div className="mt-4">
                  <p className="font-medium">Explication :</p>
                  <p>{currentQuestion.explication}</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
