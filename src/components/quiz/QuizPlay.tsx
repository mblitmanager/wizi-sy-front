
import React from 'react';
import { useParams } from 'react-router-dom';
import { Question } from './Question';
import { Timer, HelpCircle, History, BarChart, Trophy } from 'lucide-react';
import { LoadingState } from './quiz-play/LoadingState';
import { ErrorState } from './quiz-play/ErrorState';
import { QuizNavigation } from './quiz-play/QuizNavigation';
import { QuizHistoryDialog } from './quiz-play/QuizHistoryDialog';
import { QuizStatsDialog } from './quiz-play/QuizStatsDialog';
import { QuizResultsDialog } from './quiz-play/QuizResultsDialog';
import { Button } from '@/components/ui/button';
import { useQuizPlay } from '@/hooks/useQuizPlay';
import { formatTime } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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
    closeResultsDialog: closeResults
  } = useQuizPlay(quizId || '');

  const [showHint, setShowHint] = React.useState(false);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !quiz) {
    return <ErrorState />;
  }

  const progressPercentage = ((activeStep + 1) / totalQuestions) * 100;

  const calculateScore = () => {
    // Simple calculation for display purposes
    const answeredQuestions = Object.keys(answers).length;
    return answeredQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  };

  const toggleHint = () => {
    setShowHint((prev) => !prev);
  };

  const handleRestart = () => {
    // Not yet implemented
    window.location.reload();
  };

  // Get level badge color based on difficulty
  const getLevelBadgeClass = () => {
    const niveau = quiz.niveau ? quiz.niveau.toLowerCase() : '';
    
    if (niveau === 'débutant' || niveau === 'debutant') {
      return 'bg-green-500 hover:bg-green-600';
    } else if (niveau === 'intermédiaire' || niveau === 'intermediaire') {
      return 'bg-yellow-500 hover:bg-yellow-600';
    } else if (niveau === 'avancé' || niveau === 'avance') {
      return 'bg-red-500 hover:bg-red-600';
    }
    
    return 'bg-primary hover:bg-primary/90';
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
        <div className="flex items-center gap-3">
          <Badge className={getLevelBadgeClass()}>
            {quiz.niveau}
          </Badge>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">{quiz.points} points</span>
          </div>
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
      
      {/* Quiz Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Question {activeStep + 1} sur {totalQuestions}</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>
         {showHint && currentQuestion?.astuce && (
            <div className="my-4 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900">
              <strong>Astuce :</strong> {currentQuestion.astuce}
            </div>
          )}
      {currentQuestion && (
        <>
          <div className="flex-grow">
            <QuestionDisplay 
              question={currentQuestion} 
              onAnswer={(answer) => handleAnswer(answer)}
              currentAnswer={answers[currentQuestion.id]}
              showFeedback={showResults}
            />
          </div>
         
        </>
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
          isCorrect: false, // Placeholder, would need actual validation
          points: 0 // Placeholder, would need actual calculation
        }))}
        questions={quiz.questions || []}
        onRestart={handleRestart}
      />
    </div>
  );
}

// Create a QuestionDisplay component to handle rendering of questions
function QuestionDisplay({ question, onAnswer, currentAnswer, showFeedback = false }) {
  return (
    <Question
      question={question}
      onAnswer={onAnswer}
      showFeedback={showFeedback}
    />
  );
}
