import React from "react";
import { useParams } from "react-router-dom";
import { Question } from "./Question";
import { LoadingState } from "./quiz-play/LoadingState";
import { ErrorState } from "./quiz-play/ErrorState";
import { QuizNavigation } from "./quiz-play/QuizNavigation";
import { QuizHistoryDialog } from "./quiz-play/QuizHistoryDialog";
import { QuizStatsDialog } from "./quiz-play/QuizStatsDialog";
import { QuizResultsDialog } from "./quiz-play/QuizResultsDialog";
import { useQuizPlay } from "@/hooks/useQuizPlay";
import { QuizHeader } from "./quiz-play/QuizHeader";
import { QuizProgress } from "./quiz-play/QuizProgress";
import { QuizHint } from "./quiz-play/QuizHint";

export function QuizPlay() {
  const { quizId } = useParams<{ quizId: string }>();
  const {
    quiz,
    currentQuestion,
    currentQuestionIndex: activeStep,
    totalQuestions,
    isLastQuestion,
    answers,
    isLoading,
    error,
    timeLeft,
    timeSpent,
    isPaused,
    historyOpen: showHistory,
    statsOpen: showStats,
    resultsOpen: showResults,
    history: quizHistory,
    stats: quizStats,
    submitAnswer: handleAnswer,
    goToNextQuestion: handleNext,
    goToPreviousQuestion: handleBack,
    submitQuiz: handleFinish,
    openHistory: toggleHistory,
    closeHistoryDialog,
    openStats: toggleStats,
    closeStatsDialog,
    openResultsDialog,
    closeResultsDialog: closeResults,
  } = useQuizPlay(quizId || "");

  const [showHint, setShowHint] = React.useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !quiz) {
    return <ErrorState />;
  }

  const calculateScore = () => {
    const answeredQuestions = Object.keys(answers).length;
    return answeredQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  };

  const toggleHint = () => {
    setShowHint((prev) => !prev);
  };

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 sm:py-8 flex flex-col overflow-x-hidden">
      <QuizHeader
        timeLeft={timeLeft}
        niveau={quiz.niveau}
        points={quiz.points}
        onToggleHint={toggleHint}
        onToggleHistory={toggleHistory}
        onToggleStats={toggleStats}
      />

      <QuizProgress currentStep={activeStep} totalSteps={totalQuestions} />

      <QuizHint hint={currentQuestion?.astuce} visible={showHint} />

      {currentQuestion && (
        <div className="flex-grow w-full max-w-full overflow-x-hidden">
          <Question
            question={currentQuestion}
            onAnswer={(answer) => handleAnswer(answer)}
            showFeedback={showResults}
          />
        </div>
      )}

      <QuizNavigation
        activeStep={activeStep}
        totalSteps={totalQuestions}
        onBack={handleBack}
        onNext={handleNext}
        onFinish={handleFinish}
      />

      <QuizHistoryDialog
        open={showHistory}
        onClose={closeHistoryDialog}
        history={quizHistory || []}
      />

      <QuizStatsDialog
        open={showStats}
        onClose={closeStatsDialog}
        stats={quizStats}
      />

      <QuizResultsDialog
        open={showResults}
        onClose={closeResults}
        score={calculateScore()}
        totalQuestions={totalQuestions}
        answers={Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          selectedOptions: answer,
          isCorrect: false,
          points: 0,
        }))}
        questions={quiz.questions || []}
        onRestart={handleRestart}
      />
    </div>
  );
}
