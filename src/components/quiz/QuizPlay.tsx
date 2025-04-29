
import React from 'react';
import { useParams } from 'react-router-dom';
import { Question } from './Question';
import { Timer, HelpCircle, History, BarChart } from 'lucide-react';
import { LoadingState } from './quiz-play/LoadingState';
import { ErrorState } from './quiz-play/ErrorState';
import { QuizNavigation } from './quiz-play/QuizNavigation';
import { QuizHistoryDialog } from './quiz-play/QuizHistoryDialog';
import { QuizStatsDialog } from './quiz-play/QuizStatsDialog';
import { QuizResultsDialog } from './quiz-play/QuizResultsDialog';
import { Button } from '@/components/ui/button';
import { useQuizPlay } from '@/hooks/useQuizPlay';
import { formatTime } from '@/lib/utils';

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
    isHistoryOpen: showHistory,
    isStatsOpen: showStats,
    isResultsOpen: showResults,
    quizHistory,
    quizStats,
    submitAnswer: handleAnswer,
    goToNextQuestion: handleNext,
    goToPreviousQuestion: handleBack,
    submitQuiz: handleFinish,
    openHistoryDialog: toggleHistory,
    closeHistoryDialog,
    openStatsDialog: toggleStats,
    closeStatsDialog,
    openResultsDialog,
    closeResultsDialog: closeResults
  } = useQuizPlay(quizId || '');

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !quiz || !quiz.questions || quiz.questions.length === 0) {
    return <ErrorState />;
  }

  const quizQuestions = quiz.questions;
  const totalQuestionCount = quizQuestions.length;

  const calculateScore = () => {
    // Simple calculation for display purposes
    const answeredQuestions = Object.keys(answers).length;
    return answeredQuestions > 0 ? Math.round((answeredQuestions / totalQuestionCount) * 100) : 0;
  };

  const toggleHint = () => {
    // Not yet implemented
    console.log("Show hint functionality not yet implemented");
  };

  const handleRestart = () => {
    // Not yet implemented
    console.log("Restart functionality not yet implemented");
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          <span className="font-mono">
            {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleHint}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleHistory}
          >
            <History className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleStats}
          >
            <BarChart className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {currentQuestion && (
        <Question
          question={currentQuestion}
          onAnswer={(answer) => handleAnswer(answer)}
          showFeedback={showResults}
        />
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
        answers={answers}
        questions={quizQuestions}
        onRestart={handleRestart}
      />
    </div>
  );
}
