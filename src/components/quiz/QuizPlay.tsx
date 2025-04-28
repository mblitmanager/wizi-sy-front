
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
    activeStep,
    quizQuestions,
    quizHistory,
    quizStats,
    answers,
    showResults,
    timeLeft,
    showHint,
    showHistory,
    showStats,
    isLoading,
    error,
    handleAnswer,
    handleNext,
    handleBack,
    handleFinish,
    calculateScore,
    toggleHint,
    toggleHistory,
    toggleStats,
    closeResults,
    handleRestart
  } = useQuizPlay(quizId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !quizQuestions || quizQuestions.length === 0) {
    return <ErrorState />;
  }

  const currentQuestion = quizQuestions[activeStep];
  const totalQuestions = quizQuestions.length;

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

      <Question
        question={currentQuestion}
        onAnswer={(answer) => handleAnswer(answer)}
        showFeedback={showResults}
      />

      <QuizNavigation
        activeStep={activeStep}
        totalSteps={totalQuestions}
        onBack={handleBack}
        onNext={handleNext}
        onFinish={handleFinish}
      />

      <QuizHistoryDialog
        open={showHistory}
        onClose={toggleHistory}
        history={quizHistory?.data || []}
      />

      <QuizStatsDialog
        open={showStats}
        onClose={toggleStats}
        stats={quizStats?.data}
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
