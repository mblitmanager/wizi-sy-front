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
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function QuizPlay() {
  console.log("QuizPlay component mounted");
  const { quizId } = useParams<{ quizId: string }>();
  console.log("quizId from useParams:", quizId);

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
  console.log("quiz data from useQuizPlay:", { quiz, isLoading, error });

  const [showHint, setShowHint] = React.useState(false);
  const [direction, setDirection] = React.useState(0);
  const [showSwipeHint, setShowSwipeHint] = React.useState(true);

  // Masquer l'indication de glissement après 5 secondes
  React.useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isLastQuestion) {
        setDirection(1);
        handleNext();
        setShowSwipeHint(false);
      }
    },
    onSwipedRight: () => {
      if (activeStep > 0) {
        setDirection(-1);
        handleBack();
        setShowSwipeHint(false);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  if (isLoading) {
    console.log("Loading state");
    return <LoadingState />;
  }

  if (error || !quiz) {
    console.log("Error state:", error);
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeHintVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: [0, 1, 1, 0],
      transition: {
        duration: 2,
        repeat: 2,
        repeatType: "reverse" as const
      }
    }
  };

  console.log("Rendering quiz with data:", {
    currentQuestion,
    activeStep,
    totalQuestions,
    answers
  });

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 sm:py-8 flex flex-col overflow-x-hidden min-h-screen relative">
      <QuizHeader
        title={quiz.titre}
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
        <div 
          {...handlers}
          className="flex-grow w-full max-w-full overflow-x-hidden touch-pan-y relative"
        >
          {showSwipeHint && activeStep === 0 && (
            <motion.div
              className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none z-10"
              variants={swipeHintVariants}
              initial="initial"
              animate="animate"
            >
              <div className="flex items-center gap-2 text-blue-500">
                <ChevronLeft className="h-6 w-6" />
                <span className="text-sm font-medium">Glissez</span>
              </div>
              <div className="flex items-center gap-2 text-blue-500">
                <span className="text-sm font-medium">Glissez</span>
                <ChevronRight className="h-6 w-6" />
              </div>
            </motion.div>
          )}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="w-full"
            >
              <Question
                question={currentQuestion}
                onAnswer={(answer) => handleAnswer(answer)}
                showFeedback={showResults}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Fixed footer */}
      <div className="fixed left-0 w-full bg-white border-t z-50 mb-10 sm:mb-0 bottom-0 md:left-64 md:w-[calc(100%-16rem)]">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <QuizNavigation
            activeStep={activeStep}
            totalSteps={totalQuestions}
            onBack={handleBack}
            onNext={handleNext}
            onFinish={handleFinish}
          />
        </div>
      </div>

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
