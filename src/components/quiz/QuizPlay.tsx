
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizSubmissionService } from "@/services/quiz/QuizSubmissionService";
import type { Question, Quiz, QuizResult } from "@/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingState } from "./quiz-play/LoadingState";
import { ErrorState } from "./quiz-play/ErrorState";
import { QuestionDisplay } from "./quiz-play/QuestionDisplay";
import { QuizTimer } from "./quiz-play/Timer";
import { QuizSummary } from "./QuizSummary";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswerDialog, setShowAnswerDialog] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const { data: questions, isLoading, error } = useQuery({
    queryKey: ["quiz", id, "questions"],
    queryFn: () => quizSubmissionService.getQuizQuestions(parseInt(id!)),
    enabled: !!id && !!localStorage.getItem('token')
  });

  if (isLoading) return <LoadingState />;
  if (error || !questions || questions.length === 0) return <ErrorState />;

  const handleAnswerChange = (value: string | string[] | Record<string, string>) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    let formattedValue: string[];
    
    // Normaliser la valeur pour qu'elle soit toujours un tableau de chaînes
    if (typeof value === 'string') {
      formattedValue = [value];
    } else if (Array.isArray(value)) {
      formattedValue = value;
    } else {
      // Si c'est un objet, prendre les valeurs
      formattedValue = Object.values(value);
    }
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: formattedValue
    }));
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    setShowAnswerDialog(true);

    // Passer à la question suivante après un délai
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setShowAnswerDialog(false);
        setCurrentQuestionIndex(prev => prev + 1);
        setShowHint(false);
      }, 3000);
    } else {
      // C'est la dernière question, soumettre le quiz
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const result = await quizSubmissionService.submitQuiz(id!, userAnswers, timeSpent);
      setQuizResult(result);
      setShowAnswerDialog(false);
      setShowSummary(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du quiz",
        variant: "destructive"
      });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentUserAnswers = userAnswers[currentQuestion?.id || ''];
  const isAnswered = !!currentUserAnswers && currentUserAnswers.length > 0;

  // Trouver la bonne réponse pour la question actuelle
  const correctAnswer = currentQuestion?.answers?.find(a => a.isCorrect);
  const isCurrentAnswerCorrect = currentUserAnswers && 
    correctAnswer && 
    currentUserAnswers.includes(correctAnswer.id);

  if (showSummary && quizResult) {
    return (
      <QuizSummary
        questions={quizResult.questions || questions}
        userAnswers={userAnswers}
        score={quizResult.score}
        totalQuestions={quizResult.totalQuestions || questions.length}
      />
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quiz</h1>
        <QuizTimer timeSpent={timeSpent} setTimeSpent={setTimeSpent} isActive={!showSummary} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Question {currentQuestionIndex + 1} sur {questions.length}
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

          <div className="text-lg font-medium mb-6">
            {currentQuestion.text}
          </div>

          <QuestionDisplay 
            question={currentQuestion} 
            onAnswer={handleAnswerChange}
          />

          <div className="flex justify-end">
            <Button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
            >
              {currentQuestionIndex === questions.length - 1
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
              {isCurrentAnswerCorrect
                ? "Bonne réponse !"
                : "Mauvaise réponse"}
            </h3>
            <div className="space-y-2">
              <p>La bonne réponse était :</p>
              <p className="font-medium text-green-600">
                {correctAnswer?.text}
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
