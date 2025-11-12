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
  <div
    className="max-w-4xl mx-auto px-2 sm:px-4 sm:py-8 flex flex-col overflow-x-hidden min-h-screen relative"
    style={{
      marginTop:
        typeof window !== "undefined" && window.innerWidth < 640
          ? window.innerWidth < 400
            ? "-15%"
            : "-10%"
          : undefined,
    }}>
    <QuizHeader
      title={quiz.titre}
      timeLeft={timeLeft}
      niveau={quiz.niveau}
      points={quiz.points}
      onToggleHint={onToggleHint}
      onToggleHistory={onToggleHistory}
      onToggleStats={onToggleStats}
    />

    <QuizProgress currentStep={activeStep} totalSteps={totalQuestions} />

    <QuizHint hint={currentQuestion?.astuce} visible={showHint} />

    {currentQuestion && (
      <div
        {...handlers}
        className="flex-grow w-full max-w-full overflow-x-hidden touch-pan-y relative">
        {showSwipeHint && activeStep === 0 && (
          <SwipeTutorial tutorialStep={tutorialStep} />
        )}

        <div className="w-full">
          <Question
            question={currentQuestion}
            onAnswer={onAnswer}
            showFeedback={showResults}
          />
        </div>
      </div>
    )}

    <QuizFooter
      activeStep={activeStep}
      totalQuestions={totalQuestions}
      onBack={onBack}
      onNext={onNext}
      onFinish={onFinish}
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
      onRestart={onRestart}
    />
  </div>
);
