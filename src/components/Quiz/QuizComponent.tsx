import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/api';
import { Question, Quiz, QuizResponse, QuizSubmitResponse } from '../../types/quiz';

interface QuizComponentProps {
  quizId: string;
  onComplete: (score: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quizId, onComplete }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await quizService.getQuiz(quizId) as QuizResponse;
        setQuiz(response.data);
        setQuestions(response.data.questions);
      } catch (err) {
        setError('Erreur lors du chargement du quiz');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  const handleAnswerSelect = (questionId: string, answer: any) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await quizService.submitQuiz(quizId, selectedAnswers) as QuizSubmitResponse;
      setScore(response.data.score);
      onComplete(response.data.score);
    } catch (err) {
      setError('Erreur lors de la soumission du quiz');
    }
  };

  if (isLoading) {
    return <div>Chargement du quiz...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!quiz || questions.length === 0) {
    return <div>Aucun quiz trouvé</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{quiz.title}</h2>
        <div className="progress">
          Question {currentQuestionIndex + 1} sur {questions.length}
        </div>
      </div>

      <div className="question-container">
        <h3>{currentQuestion.text}</h3>
        
        {currentQuestion.type === 'multiple_choice' && (
          <div className="options">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                className={`option ${selectedAnswers[currentQuestion.id] === option ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'true_false' && (
          <div className="options">
            <button
              className={`option ${selectedAnswers[currentQuestion.id] === true ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(currentQuestion.id, true)}
            >
              Vrai
            </button>
            <button
              className={`option ${selectedAnswers[currentQuestion.id] === false ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(currentQuestion.id, false)}
            >
              Faux
            </button>
          </div>
        )}

        {currentQuestion.type === 'fill_blank' && (
          <input
            type="text"
            value={selectedAnswers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
            placeholder="Votre réponse..."
          />
        )}
      </div>

      <div className="navigation-buttons">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Précédent
        </button>
        
        {currentQuestionIndex < questions.length - 1 ? (
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Suivant
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswers[currentQuestion.id]}
          >
            Terminer
          </button>
        )}
      </div>

      {score > 0 && (
        <div className="score-display">
          Votre score : {score}%
        </div>
      )}
    </div>
  );
};

export default QuizComponent; 