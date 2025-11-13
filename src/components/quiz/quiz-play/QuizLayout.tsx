import { Question } from "../Question";
import { QuizFooter } from "./QuizFooter";
import { QuizHeader } from "./QuizHeader";
import { QuizHint } from "./QuizHint";
import { QuizProgress } from "./QuizProgress";
import { QuizResultsDialog } from "./QuizResultsDialog";
import { SwipeTutorial } from "./SwipeTutorial";

export const QuizLayout = ({
  handlers,
  quiz,
  activeStep,
  totalQuestions,
  timeLeft,
  showHint,
  showSwipeHint,
  tutorialStep,
  currentQuestion,
  showResults,
  answers,
  onToggleHint,
  onToggleHistory,
  onToggleStats,
  onAnswer,
  onBack,
  onNext,
  onFinish,
  onRestart,
  closeResults,
  calculateScore,
}) => (
  <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 flex flex-col min-h-screen bg-background">
    {/* Header */}
    <div className="flex-shrink-0">
      <QuizHeader
        title={quiz.titre}
        timeLeft={timeLeft}
        niveau={quiz.niveau}
        points={quiz.points}
        onToggleHint={onToggleHint}
        onToggleHistory={onToggleHistory}
        onToggleStats={onToggleStats}
      />
    </div>

    {/* Progress Bar */}
    <div className="flex-shrink-0 mt-4 sm:mt-5 lg:mt-6">
      <QuizProgress currentStep={activeStep} totalSteps={totalQuestions} />
    </div>

    {/* Hint */}
    <div className="flex-shrink-0 mt-3 sm:mt-4">
      <QuizHint hint={currentQuestion?.astuce} visible={showHint} />
    </div>

    {/* Question Area - Section flexible et scrollable */}
    <div
      {...handlers}
      className="flex-1 w-full max-w-full overflow-hidden mt-4 sm:mt-5 lg:mt-6 relative min-h-[400px]">
      {showSwipeHint && activeStep === 0 && (
        <SwipeTutorial tutorialStep={tutorialStep} />
      )}

      {/* État de chargement de la question */}
      {!currentQuestion ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de la question...</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="w-full max-w-2xl mx-auto">
            <Question
              question={currentQuestion}
              onAnswer={onAnswer}
              showFeedback={showResults}
            />
          </div>
        </div>
      )}
    </div>

    {/* Footer - Conditionnel si on a une question */}
    {currentQuestion && (
      <div className="flex-shrink-0 mt-6 sm:mt-7 lg:mt-8">
        <QuizFooter
          activeStep={activeStep}
          totalQuestions={totalQuestions}
          onBack={onBack}
          onNext={onNext}
          onFinish={onFinish}
        />
      </div>
    )}

    {/* Results Dialog */}
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
      onRestart={onRestart}
    />
  </div>
);
