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
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

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
  const [showSwipeHint, setShowSwipeHint] = React.useState(true);
  const [tutorialStep, setTutorialStep] = React.useState(0);

  // Masquer l'indication de glissement après 5 secondes
  React.useEffect(() => {
    console.log("Tutorial visibility effect:", { showSwipeHint, activeStep });
    if (showSwipeHint) {
      const timer = setTimeout(() => {
        console.log("Hiding tutorial after timeout");
        setShowSwipeHint(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);

  // Animation du tutoriel
  React.useEffect(() => {
    console.log("Tutorial animation effect:", { showSwipeHint, activeStep, tutorialStep });
    if (showSwipeHint && activeStep === 0) {
      const interval = setInterval(() => {
        setTutorialStep((prev) => (prev + 1) % 3);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showSwipeHint, activeStep]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isLastQuestion) {
        handleNext();
        setShowSwipeHint(false);
      }
    },
    onSwipedRight: () => {
      if (activeStep > 0) {
        handleBack();
        setShowSwipeHint(false);
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
    delta: 10,
    swipeDuration: 500,
    touchEventOptions: { passive: false }
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

  console.log("Rendering quiz with data:", {
    currentQuestion,
    activeStep,
    totalQuestions,
    answers,
    showSwipeHint,
    tutorialStep
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
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 z-50">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Bienvenue dans le quiz !</h3>
                <p className="text-gray-600">Apprenez à naviguer entre les questions</p>
              </div>
              
              <div className="relative w-64 h-32 bg-gray-100 rounded-lg shadow-lg mb-8">
                <div 
                  className={`absolute top-1/2 -translate-y-1/2 w-16 h-16 bg-amber-500 rounded-lg shadow-md transition-transform duration-500 ease-in-out ${
                    tutorialStep === 0 ? 'left-4' : 
                    tutorialStep === 1 ? 'left-1/2 -translate-x-1/2' : 
                    'right-4'
                  }`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-amber-500">
                <div className="flex items-center gap-2">
                  <ChevronLeft className="h-6 w-6" />
                  <span className="text-sm font-medium">Glissez à gauche</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Glissez à droite</span>
                  <ChevronRight className="h-6 w-6" />
                </div>
              </div>
            </div>
          )}
          <div className="w-full">
            <Question
              question={currentQuestion}
              onAnswer={(answer) => handleAnswer(answer)}
              showFeedback={showResults}
            />
          </div>
        </div>
      )}

      {/* Fixed footer */}
      <div className="fixed left-0 w-full bg-white border-t z-50 mb-10 sm:mb-0 bottom-0 md:left-64 md:w-[calc(100%-16rem)]">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <div className="text-center text-sm text-gray-500 mb-2">
            Utilisez les flèches ou glissez pour naviguer entre les questions
          </div>
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
