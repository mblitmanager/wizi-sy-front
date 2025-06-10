import React from "react";
import { useParams } from "react-router-dom";
import { LoadingState } from "./quiz-play/LoadingState";
import { ErrorState } from "./quiz-play/ErrorState";
import { useQuizPlay } from "@/hooks/useQuizPlay";
import { useSwipeable } from "react-swipeable";
import { QuizLayout } from "./quiz-play/QuizLayout";

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
    showResults,
    handleAnswer,
    handleNext,
    handleBack,
    handleFinish,
    toggleHistory,
    toggleStats,
    closeResults,
  } = useQuizPlay(quizId || "");

  // États locaux
  const [showHint, setShowHint] = React.useState(false);
  const [showSwipeHint, setShowSwipeHint] = React.useState(true);
  const [tutorialStep, setTutorialStep] = React.useState(0);

  // Effets
  React.useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => setShowSwipeHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);

  React.useEffect(() => {
    if (showSwipeHint && activeStep === 0) {
      const interval = setInterval(() => {
        setTutorialStep((prev) => (prev + 1) % 3);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showSwipeHint, activeStep]);

  // Handlers
  const handlers = useSwipeable({
    onSwipedLeft: () => !isLastQuestion && handleNext(),
    onSwipedRight: () => activeStep > 0 && handleBack(),
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 10,
    swipeDuration: 500,
    touchEventOptions: { passive: false },
  });

  const calculateScore = React.useCallback(() => {
    const answeredQuestions = Object.keys(answers).length;
    return answeredQuestions > 0
      ? Math.round((answeredQuestions / totalQuestions) * 100)
      : 0;
  }, [answers, totalQuestions]);
  const toggleHint = React.useCallback(() => {
    setShowHint((prev) => !prev);
  }, []);

  const handleRestart = React.useCallback(() => {
    window.location.reload();
  }, []);

  // Rendu conditionnel
  if (isLoading) return <LoadingState />;
  if (error || !quiz) return <ErrorState />;

  return (
    <QuizLayout
      handlers={handlers}
      quiz={quiz}
      activeStep={activeStep}
      totalQuestions={totalQuestions}
      timeLeft={timeLeft}
      showHint={showHint}
      showSwipeHint={showSwipeHint}
      tutorialStep={tutorialStep}
      currentQuestion={currentQuestion}
      showResults={showResults}
      answers={answers}
      onToggleHint={toggleHint}
      onToggleHistory={toggleHistory}
      onToggleStats={toggleStats}
      onAnswer={handleAnswer}
      onBack={handleBack}
      onNext={handleNext}
      onFinish={handleFinish}
      onRestart={handleRestart}
      closeResults={closeResults}
      calculateScore={calculateScore}
    />
  );
}
