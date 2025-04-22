import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { quizService, type Question, type QuestionType } from "@/services/QuizService";
import { Loader2, AlertCircle, Timer, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizSummary } from "./QuizSummary";
import { MultipleChoice } from "./question-types/MultipleChoice";
import { Ordering } from "./question-types/Ordering";
import { FillBlank } from "./question-types/FillBlank";
import { WordBank } from "./question-types/WordBank";
import { Flashcard } from "./question-types/FlashCard";
import { Matching } from "./question-types/Matching";
import { AudioQuestion } from "./question-types/AudioQuestion";
import { TrueFalse } from "./question-types/TrueFalse";

type QuestionValue = string | string[] | Record<string, string>;

export function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, QuestionValue>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => quizService.getQuizById(id!),
    enabled: !!id && !!localStorage.getItem('token')
  });

  // Timer effect
  useEffect(() => {
    if (!showSummary) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showSummary]);

  const handleAnswerChange = (value: QuestionValue) => {
    const currentQuestion = quiz?.questions[currentQuestionIndex];
    if (currentQuestion) {
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: value
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHint(false);
    } else {
      // Calculer le score
      const newScore = quiz?.questions.reduce((acc, question) => {
        const userAnswer = userAnswers[question.id];
        let isCorrect = false;

        switch (question.type) {
          case 'choix multiples':
          case 'vrai/faux':
          case 'question audio':
            isCorrect = question.answers?.find(a => 
              a.id === userAnswer && (a.isCorrect || a.reponse_correct)
            ) !== undefined;
            break;

          case 'rearrangement':
            const userOrder = userAnswer as string[];
            const correctOrder = question.answers?.sort((a, b) => 
              (a.position || 0) - (b.position || 0)
            ).map(a => a.id);
            isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
            break;

          case 'remplir le champ vide':
          case 'banque de mots':
            const answers = userAnswer as Record<string, string>;
            isCorrect = question.blanks?.every(blank => {
              const userText = answers[blank.bankGroup];
              return userText?.toLowerCase() === blank.text.toLowerCase();
            }) || false;
            break;

          case 'correspondance':
            const matches = userAnswer as Record<string, string>;
            isCorrect = question.matching?.every(item => {
              const matchedItem = question.matching?.find(m => 
                matches[item.id] === m.id || matches[m.id] === item.id
              );
              return matchedItem?.matchPair === item.matchPair;
            }) || false;
            break;

          case 'carte flash':
            // Les flashcards n'ont pas de score
            isCorrect = true;
            break;
        }

        return acc + (isCorrect ? (question.points || 1) : 0);
      }, 0) || 0;

      setScore(newScore);
      setShowSummary(true);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      // Convertir les réponses au format attendu par l'API
      const formattedAnswers: Record<string, string[]> = {};
      Object.entries(userAnswers).forEach(([questionId, answer]) => {
        if (Array.isArray(answer)) {
          formattedAnswers[questionId] = answer;
        } else if (typeof answer === 'string') {
          formattedAnswers[questionId] = [answer];
        } else {
          formattedAnswers[questionId] = Object.values(answer);
        }
      });

      await quizService.submitQuiz(id!, formattedAnswers, timeSpent);
      navigate('/quiz/history');
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Une erreur est survenue lors du chargement du quiz. Veuillez réessayer plus tard.
        </AlertDescription>
      </Alert>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Quiz non trouvé</p>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Résumé du Quiz</h2>
            <p className="text-lg">Score: {score}/{quiz.questions.reduce((acc, q) => acc + (q.points || 1), 0)}</p>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const correctAnswer = question.answers?.find(a => a.isCorrect || a.reponse_correct)?.id;
              
              return (
                <div key={question.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      userAnswer === correctAnswer ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">{question.text}</p>
                      {question.explication && (
                        <p className="text-sm text-gray-500 mb-2">
                          Explication: {question.explication}
                        </p>
                      )}
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Votre réponse: {getAnswerText(question, userAnswer)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Bonne réponse: {getAnswerText(question, correctAnswer)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center">
            <Button onClick={handleSubmitQuiz}>
              Terminer le quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = userAnswers[currentQuestion.id];

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'choix multiples':
        return (
          <MultipleChoice
            question={question}
            onAnswer={handleAnswerChange}
          />
        );

      case 'vrai/faux':
        return (
          <TrueFalse
            question={question}
            onAnswer={handleAnswerChange}
          />
        );

      case 'rearrangement':
        return (
          <Ordering
            question={question}
            onAnswer={handleAnswerChange}
          />
        );

      case 'remplir le champ vide':
        return (
          <FillBlank
            question={question}
            onAnswer={handleAnswerChange}
          />
        );

      case 'banque de mots':
        return (
          <WordBank
            question={question}
            onAnswer={handleAnswerChange}
          />
        );

      case 'carte flash':
        return (
          <Flashcard
            question={question}
            onAnswer={handleAnswerChange}
          />
        );

      case 'correspondance':
        return (
          <Matching
            question={question}
            onAnswer={handleAnswerChange}
          />
        );

      case 'question audio':
        return (
          <AudioQuestion
            question={question}
            onAnswer={handleAnswerChange}
          />
        );

      default:
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Type de question non supporté</AlertTitle>
            <AlertDescription>
              Le type de question "{question.type}" n'est pas encore implémenté.
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{quiz.titre}</h1>
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Question {currentQuestionIndex + 1} sur {quiz.questions.length}
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

          {renderQuestion(currentQuestion)}

          <div className="flex justify-end">
            <Button
              onClick={handleNextQuestion}
              disabled={!currentAnswer}
            >
              {currentQuestionIndex === quiz.questions.length - 1
                ? "Terminer"
                : "Question suivante"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get answer text
const getAnswerText = (question: Question, answerId: string | string[] | Record<string, string> | undefined) => {
  if (!answerId) return "Non répondu";
  
  if (typeof answerId === 'string') {
    return question.answers?.find(a => a.id === answerId)?.text || answerId;
  }
  
  if (Array.isArray(answerId)) {
    return answerId.map(id => question.answers?.find(a => a.id === id)?.text || id).join(', ');
  }
  
  if (typeof answerId === 'object') {
    return Object.values(answerId).map(id => question.answers?.find(a => a.id === id)?.text || id).join(', ');
  }
  
  return "Réponse non valide";
}; 